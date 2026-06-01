import { supabase } from "../utils/supabase";
import type { Database } from "../domain/database.types";
import type { Profile, ProfileSettings } from "../domain/profile";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProfileFromDatabaseRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username ?? undefined,
    gradeSystemRoutes: row.grade_system_routes,
    gradeSystemBoulder: row.grade_system_boulder,
    disciplines: row.disciplines ?? undefined,
    location: row.location ?? undefined,
    instagram: row.instagram ?? undefined,
    isPrivate: row.is_private,
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

// update the current user's editable settings. RLS (auth.uid() = id) ensures a
// user can only update their own row. empty values are stored as NULL.
export async function updateProfileSettings(
  userId: string,
  settings: ProfileSettings,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      grade_system_routes: settings.gradeSystemRoutes,
      grade_system_boulder: settings.gradeSystemBoulder,
      disciplines: settings.disciplines?.length ? settings.disciplines : null,
      location: settings.location?.trim() || null,
      instagram: settings.instagram?.trim() || null,
      is_private: settings.isPrivate,
    })
    .eq("id", userId);
  if (error) throw error;
}
