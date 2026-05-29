import { supabase } from "../utils/supabase";
import type { Database } from "../domain/database.types";
import type { Profile } from "../domain/profile";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProfileFromDatabaseRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username ?? undefined,
  };
}

// load a user's profile. the handle_new_user trigger guarantees a row exists,
// but maybeSingle() returns null instead of throwing if it somehow doesn't.
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProfileFromDatabaseRow(data) : null;
}

// set the current user's username. RLS (auth.uid() = id) ensures a user can
// only update their own row; a UNIQUE violation surfaces as a thrown error.
export async function setUsername(
  userId: string,
  username: string,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return mapProfileFromDatabaseRow(data);
}
