import { useCallback, useEffect, useState } from "react";
import type { Profile } from "../domain/profile";
import { fetchProfile } from "../services/profile";

// loads the profile for the given user id. returns reload() so callers can
// refresh after a change (e.g. the user just picked a username).
export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // refresh the profile without toggling the loading flag (used after updates).
  const reload = useCallback(async () => {
    setProfile(userId ? await fetchProfile(userId) : null);
  }, [userId]);

  useEffect(() => {
    let active = true;
    (async () => {
      const next = userId ? await fetchProfile(userId) : null;
      // ignore the result if the user changed / component unmounted meanwhile
      if (active) {
        setProfile(next);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  return { profile, loading, reload };
}
