import { useState, useEffect, useRef, useCallback } from "react";
import type { ProfileSettings } from "../domain/profile";
import { fetchProfile, updateProfileSettings } from "../services/profile";

// Loads the user's editable profile settings, holds them as local state, and
// writes them back to the DB when the user leaves the page (unmount, tab close,
// or tab hide). The returned shape maps directly onto <ProfileSettings />, so
// callers can spread it: <ProfileSettings {...useProfileSettings(userId)} />.
export function useProfileSettings(userId: string | undefined) {
  const [gradeRoutes, setGradeRoutes] = useState("french");
  const [gradeBoulder, setGradeBoulder] = useState("v_scale");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // dirty: have we made a change worth persisting? latest: the snapshot the
  // save-on-leave handler reads (refs so the handler isn't re-created on edits).
  const dirty = useRef(false);
  const latest = useRef<ProfileSettings | null>(null);
  const mark = () => {
    dirty.current = true;
  };

  // Load the stored settings once we know the user. This path does not call
  // mark(), so loading never triggers a save.
  useEffect(() => {
    if (!userId) return;
    let active = true;
    fetchProfile(userId).then((profile) => {
      if (!active || !profile) return;
      setGradeRoutes(profile.gradeSystemRoutes);
      setGradeBoulder(profile.gradeSystemBoulder);
      setDisciplines(profile.disciplines ?? []);
      setLocation(profile.location ?? "");
      setInstagram(profile.instagram ?? "");
      setIsPrivate(profile.isPrivate);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  // Keep a snapshot of the latest edits for the save-on-leave handler.
  useEffect(() => {
    latest.current = {
      gradeSystemRoutes: gradeRoutes,
      gradeSystemBoulder: gradeBoulder,
      disciplines,
      location,
      instagram,
      isPrivate,
    };
  }, [gradeRoutes, gradeBoulder, disciplines, location, instagram, isPrivate]);

  const save = useCallback(() => {
    if (!userId || !dirty.current || !latest.current) return;
    dirty.current = false;
    void updateProfileSettings(userId, latest.current);
  }, [userId]);

  // Persist on page leave: unmount, tab close, and tab hide (mobile/PWA).
  useEffect(() => {
    const onHide = () => save();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      save();
    };
  }, [save]);

  return {
    gradeRoutes,
    onGradeRoutes: (v: string) => {
      mark();
      setGradeRoutes(v);
    },
    gradeBoulder,
    onGradeBoulder: (v: string) => {
      mark();
      setGradeBoulder(v);
    },
    disciplines,
    onToggleDiscipline: (d: string) => {
      mark();
      setDisciplines((prev) =>
        prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
      );
    },
    location,
    onLocation: (v: string) => {
      mark();
      setLocation(v);
    },
    instagram,
    onInstagram: (v: string) => {
      mark();
      setInstagram(v);
    },
    isPrivate,
    onIsPrivate: (v: boolean) => {
      mark();
      setIsPrivate(v);
    },
  };
}
