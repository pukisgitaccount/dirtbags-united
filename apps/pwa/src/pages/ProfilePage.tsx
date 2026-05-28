import { supabase } from "../utils/supabase";
import { useSession } from "../hooks/useSession";
import Login from "../components/Login";
import Button from "../components/Button";

export default function ProfilePage() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-400">Lädt …</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-full">
        <Login />
      </div>
    );
  }

  const isAnonymous = session.user.is_anonymous ?? false;
  const identity = isAnonymous
    ? "Gast-Konto"
    : (session.user.email ?? "Angemeldet");

  return (
    <div className="flex h-full flex-col bg-stone-50 px-6 pb-8 pt-14">
      <div className="mt-14 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Profil
        </h1>
        <p className="text-sm leading-6 text-stone-500">Du bist angemeldet.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
          Konto
        </div>
        <div className="mt-1 text-base text-stone-900">{identity}</div>
      </div>

      <Button
        label="Abmelden"
        variant="secondary"
        onClick={() => supabase.auth.signOut()}
        className="mt-auto w-full"
      />
    </div>
  );
}
