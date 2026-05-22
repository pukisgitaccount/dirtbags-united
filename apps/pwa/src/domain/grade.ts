export const GRADE_ORDER = [
  "3", "4a", "4b", "4c",
  "5a", "5b", "5c",
  "6a", "6a+", "6b", "6b+", "6c", "6c+",
  "7a", "7a+", "7b", "7b+", "7c", "7c+",
  "8a", "8a+", "8b", "8b+", "8c", "8c+",
  "9a", "9a+", "9b", "9b+", "9c",
] as const;

export const GRADE_COLORS = [
  "#d6d3d1",
  "#d97706",
  "#b45309",
  "#7c2d12",
  "#1c1917",
] as const;

// TODO(personalization): Make the color scale relative to the user's own
// climbing level instead of using absolute grade indices. Two anchor points
// drive the proposed scale:
//   - flashLevel:    max grade the user can flash    (= "comfort" boundary)
//   - rotpunktLevel: max grade the user can redpoint (= "project" boundary)
//
// Color stops would then become:
//   < flashLevel - 2          → very easy (warm sand)
//   around flashLevel         → comfort zone (lighter ochre)
//   between flash & rotpunkt  → project zone (rust)
//   > rotpunktLevel           → aspirational (dark basalt)
//
// Implementation sketch: extend `gradeColor` to
//   gradeColor(grade, opts?: { flashLevel?: string; rotpunktLevel?: string })
// and pull defaults from a future SettingsContext / Zustand store. Without
// settings, fall back to the absolute scale below.
const COLOR_STOPS: { maxIndex: number; color: string }[] = [
  { maxIndex: 6, color: GRADE_COLORS[0] },
  { maxIndex: 12, color: GRADE_COLORS[1] },
  { maxIndex: 18, color: GRADE_COLORS[2] },
  { maxIndex: 24, color: GRADE_COLORS[3] },
  { maxIndex: Infinity, color: GRADE_COLORS[4] },
];

const UNKNOWN_COLOR = "#a8a29e";

export function gradeIndex(grade: string): number {
  return GRADE_ORDER.indexOf(grade as (typeof GRADE_ORDER)[number]);
}

export function gradeColor(grade: string): string {
  const idx = gradeIndex(grade);
  if (idx === -1) return UNKNOWN_COLOR;
  return COLOR_STOPS.find((stop) => idx <= stop.maxIndex)!.color;
}
