import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { UserSession } from "../types";

function mapSession(session: Session | null): UserSession | null {
  if (!session?.user) return null;
  const user = session.user;
  const username =
    (user.user_metadata?.username as string | undefined) ??
    user.email?.split("@")[0] ??
    "Viajante";
  return {
    id: user.id,
    email: user.email ?? "",
    username,
  };
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(mapSession(data.session));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSession(session));
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      username: string
    ): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      return { error: error?.message ?? null };
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut();
  }, []);

  return { user, loading, signIn, signUp, signOut };
}
