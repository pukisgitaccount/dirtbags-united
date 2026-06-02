export interface Profile {
  id: string;
  username?: string;
  gradeSystemRoutes: string;
  gradeSystemBoulder: string;
  disciplines?: string[];
  location?: string;
  instagram?: string;
  isPrivate: boolean;
}

// the user-editable subset of a profile (everything except identity fields)
export type ProfileSettings = Pick<
  Profile,
  | "gradeSystemRoutes"
  | "gradeSystemBoulder"
  | "disciplines"
  | "location"
  | "instagram"
  | "isPrivate"
>;