import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useSession } from "../hooks/useSession";
import { useProfile } from "../hooks/useProfile";
import { useProfileSettings } from "../hooks/useProfileSettings";
import { setUsername } from "../services/profile";
import Login from "../components/Login";
import Button from "../components/Button";
import { ProfileSettings } from "../components/ProfileSettings";

function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-stone-50">
      <p className="text-sm text-stone-400">Lädt …</p>
    </div>
  );
}

function UsernameOnboarding({
  userId,
  onDone,
}: {
  userId: string;
  onDone: () => void;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const username = value.trim();
  const valid = username.length >= 3 && username.length <= 24;

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setError(null);
    try {
      await setUsername(userId, username);
      onDone();
    } catch (err) {
      // 23505 = Postgres unique_violation
      if ((err as { code?: string }).code === "23505") {
        setError("Dieser Username ist schon vergeben.");
      } else {
        setError("Speichern fehlgeschlagen. Bitte versuche es erneut.");
        console.error(err);
      }
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-stone-50 px-6 pb-8 pt-14">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Username wählen
        </h1>
        <p className="text-sm leading-6 text-stone-500">
          So erscheinst du in der Community. 3–24 Zeichen.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <label
          htmlFor="username"
          className="px-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="z. B. crimpcrusher"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-full border border-stone-200 bg-white px-5 py-3.5 text-base text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20"
        />
        <Button
          label={saving ? "Wird gespeichert …" : "Speichern"}
          type="submit"
          disabled={!valid || saving}
          className="mt-2 w-full"
        />
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const { session, loading: sessionLoading } = useSession();
  const {
    profile,
    loading: profileLoading,
    reload,
  } = useProfile(session?.user.id);
  const userId = session?.user.id;
  const settings = useProfileSettings(userId);

  if (sessionLoading) return <Loading />;

  if (!session) {
    return (
      <div className="h-full">
        <Login />
      </div>
    );
  }

  if (profileLoading) return <Loading />;

  const isAnonymous = session.user.is_anonymous ?? false;

  // email users must pick a username before seeing their profile; guests skip it
  if (!isAnonymous && !profile?.username) {
    return <UsernameOnboarding userId={session.user.id} onDone={reload} />;
  }

  const identity = isAnonymous
    ? "Gast-Konto"
    : (profile?.username ?? "Angemeldet");

  return (
    <div className="flex h-full flex-col bg-stone-50">
      {/* pinned profile name */}
      <div className="px-6 pb-4 pt-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          Profil
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          {identity}
        </h1>
      </div>

      {/* scrollable settings */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <ProfileSettings {...settings} />
      </div>

      {/* fixed sign-out */}
      <div className="border-t border-stone-200 bg-stone-50 px-6 pb-8 pt-3">
        <Button
          label="Abmelden"
          variant="secondary"
          onClick={() => supabase.auth.signOut()}
          className="w-full"
        />
      </div>
    </div>
  );
}
