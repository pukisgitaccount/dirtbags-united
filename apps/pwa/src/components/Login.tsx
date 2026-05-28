import { supabase } from "../utils/supabase";

import { EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import Button from "./Button";

// two states - login: shows the form to enter the email, sent: shows the message that the link has been sent and a countdown until it expires
type AuthState = { kind: "login" } | { kind: "sent"; email: string };

// seconds until the magic link expires - currently set to 15 minutes minus a safety buffer of 48 seconds
const TTLCountdown = 13 * 60 + 12;

export default function Login() {
  // handle login/email-sent state
  const [authState, setAuthState] = useState<AuthState>({ kind: "login" });

  return authState.kind === "login" ? (
    <LoginScreen onSent={(email) => setAuthState({ kind: "sent", email })} />
  ) : (
    <SentScreen
      email={authState.email}
      onBack={() => setAuthState({ kind: "login" })}
    />
  );
}

function LoginScreen({ onSent }: { onSent: (email: string) => void }) {
  const [email, setEmail] = useState("");
  // for showing the loading state while sending the magic link and to prevent multiple submissions
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const valid = email.length > 0 && email.includes("@") && email.includes(".");

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    if (error) {
      setError(
        "Link konnte nicht gesendet werden. Bitte versuche es später erneut.",
      );
      console.error(error);
    } else {
      console.log("Magic-Link erfolgreich gesendet:", data);
      onSent(email);
    }
  };

  const anonymousLogin = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      setError("Anmeldung fehlgeschlagen. Bitte versuche es später erneut.");
      console.error(error);
    }
    console.log("Anonyme Anmeldung erfolgreich:", data);
  };

  return (
    <div className="flex h-full flex-col bg-stone-50 px-6 pb-8 pt-14">
      <div className="mt-14 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Anmelden
        </h1>
        <p className="text-sm leading-6 text-stone-500">
          Wir senden dir einen Link per Mail. Kein Passwort nötig.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <label
          htmlFor="email"
          className="px-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500"
        >
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="acab@161.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full border border-stone-200 bg-white px-5 py-3.5 text-base text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20"
        />
        <Button
          label={sending ? "Wird gesendet …" : "mail senden"}
          type="submit"
          disabled={!valid || sending}
          className="mt-2 w-full"
        />
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-10 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        <span>oder</span>
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <Button
        label="Ohne Konto fortfahren"
        variant="secondary"
        onClick={anonymousLogin}
        className="mt-5 w-full"
      />

      <p className="mt-auto pt-10 text-center text-xs leading-relaxed text-stone-400">
        Dein Konto wird automatisch erstellt, falls noch keins existiert.
      </p>
    </div>
  );
}

function SentScreen({ email, onBack }: { email: string; onBack: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(TTLCountdown);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const resend = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(
        "Erneutes Senden fehlgeschlagen. Bitte versuche es später erneut.",
      );
      return;
    }
    setSecondsLeft(TTLCountdown);
  };

  return (
    <div className="flex h-full flex-col bg-stone-50 px-6 pb-8 pt-14">
      <div className="mt-12 flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-300/25 ring-1 ring-inset ring-orange-300/40">
          <EnvelopeIcon
            className="h-10 w-10 text-orange-700"
            strokeWidth={1.5}
          />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900">
          Link gesendet
        </h1>
        <p className="mt-2 text-pretty text-sm leading-6 text-stone-600">
          Tippe auf den Link in der E-Mail an{" "}
          <span className="font-medium text-stone-900">{email}</span>, um dich
          anzumelden.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <ClockIcon
          className="h-5 w-5 shrink-0 text-stone-500"
          strokeWidth={1.5}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-stone-700">
            Link läuft ab in
          </div>
          <div className="text-xs text-stone-500">15 Minuten gültig.</div>
        </div>
        <div className="font-mono text-lg font-semibold tabular-nums tracking-tight text-stone-900">
          {mm}:{ss}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button
        label="Nochmal senden"
        variant="secondary"
        onClick={resend}
        className="mt-4 w-full"
      />
      <Button
        label="Andere E-Mail verwenden"
        variant="ghost"
        onClick={onBack}
        className="mt-2 w-full"
      />

      <p className="mt-auto pt-10 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-stone-400">
        Keine E-Mail? Spam-Ordner prüfen.
      </p>
    </div>
  );
}
