import Card from "./Card";
import Button from "./Button";

type Option = { value: string; label: string };

const ROUTE_SYSTEMS: Option[] = [
  { value: "french", label: "Französisch" },
  { value: "uiaa", label: "UIAA" },
  { value: "yds", label: "YDS" },
];

const BOULDER_SYSTEMS: Option[] = [
  { value: "v_scale", label: "V-Scale" },
  { value: "font", label: "Fontainebleau" },
];

const DISCIPLINES = ["Sport", "Boulder", "Trad", "Mehrseillänge", "Halle", "Fels"];

type Props = {
  gradeRoutes: string;
  onGradeRoutes: (v: string) => void;
  gradeBoulder: string;
  onGradeBoulder: (v: string) => void;
  disciplines: string[];
  onToggleDiscipline: (v: string) => void;
  location: string;
  onLocation: (v: string) => void;
  instagram: string;
  onInstagram: (v: string) => void;
  isPrivate: boolean;
  onIsPrivate: (v: boolean) => void;
};

// pill group built from the shared Button: selected = primary, rest = secondary
function PillGroup({
  options,
  isActive,
  onSelect,
}: {
  options: Option[];
  isActive: (value: string) => boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          label={opt.label}
          variant={isActive(opt.value) ? "primary" : "secondary"}
          onClick={() => onSelect(opt.value)}
        />
      ))}
    </div>
  );
}

export function ProfileSettings({
  gradeRoutes,
  onGradeRoutes,
  gradeBoulder,
  onGradeBoulder,
  disciplines,
  onToggleDiscipline,
  location,
  onLocation,
  instagram,
  onInstagram,
  isPrivate,
  onIsPrivate,
}: Props) {
  const inputClass =
    "w-full rounded-full border border-stone-200 bg-white px-5 py-3.5 text-base text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-400/20";

  return (
    <div className="mt-2 space-y-4">
      <Card title="Bewertungsskala Routen">
        <PillGroup
          options={ROUTE_SYSTEMS}
          isActive={(v) => v === gradeRoutes}
          onSelect={onGradeRoutes}
        />
      </Card>

      <Card title="Bewertungsskala Boulder">
        <PillGroup
          options={BOULDER_SYSTEMS}
          isActive={(v) => v === gradeBoulder}
          onSelect={onGradeBoulder}
        />
      </Card>

      <Card
        title="Disziplinen"
        description="Womit kletterst du? Mehrfachauswahl möglich."
      >
        <PillGroup
          options={DISCIPLINES.map((d) => ({ value: d, label: d }))}
          isActive={(v) => disciplines.includes(v)}
          onSelect={onToggleDiscipline}
        />
      </Card>

      <Card title="Standort">
        <input
          type="text"
          value={location}
          onChange={(e) => onLocation(e.target.value)}
          placeholder="Stadt / Region"
          className={inputClass}
        />
      </Card>

      <Card title="Instagram">
        <input
          type="text"
          value={instagram}
          onChange={(e) => onInstagram(e.target.value)}
          placeholder="@handle"
          className={inputClass}
        />
      </Card>

      <Card
        title="Sichtbarkeit"
        description="Wer darf dein Profil sehen?"
      >
        <PillGroup
          options={[
            { value: "public", label: "Öffentlich" },
            { value: "private", label: "Privat" },
          ]}
          isActive={(v) => (v === "private") === isPrivate}
          onSelect={(v) => onIsPrivate(v === "private")}
        />
      </Card>
    </div>
  );
}
