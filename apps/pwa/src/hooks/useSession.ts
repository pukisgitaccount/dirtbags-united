import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

// central auth-state hook: reads the current session once on mount and then
// stays in sync via Supabase's auth listener. loading is true until the
// initial getSession() resolves, so callers don't flash the logged-out UI.
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initial value from localStorage (may refresh the token first)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // react to later sign-in / sign-out / token-refresh / magic-link redirect
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // exactly one active listener: clean up on unmount
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
