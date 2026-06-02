import type { ReactNode } from "react";
import type { Tick } from "../domain/tick";
import type { Route } from "../domain/route";
import type { Crag } from "../domain/crag";

import Button from "../components/Button";
import TicklistEntry from "../components/TicklistEntry";
import CragRoutesDisplay from "../components/CragRoutesDisplay";
import CragPopup from "../components/CragPopup";

const sampleEntry: Tick = {
  id: 1,
  date: "2026-04-23",
  routeName: "Wand der Träume",
  cragName: "Herzogenreuther Wand",
  sectorName: "Hauptwand",
  grade: "7a",
  tickType: "Rotpunkt",
  rating: 5,
};

const sampleEntry2: Tick = {
  id: 2,
  date: "2026-04-20",
  routeName: "Nordkante",
  cragName: "Stahlberg",
  sectorName: "Sektor B",
  grade: "6c+",
  tickType: "Onsight",
  rating: 5,
};

const sampleEntry3: Tick = {
  id: 3,
  date: "2026-04-21",
  routeName: "Morgenwind",
  cragName: "Weißenstein",
  sectorName: "Linke Wand",
  grade: "7b",
  tickType: "Flash",
  rating: 5,
};

const sampleEntry4: Tick = {
  id: 4,
  date: "2026-04-22",
  routeName: "Sonnenriss",
  cragName: "Herzogenreuther Wand",
  sectorName: "Rechte Wand",
  grade: "6b",
  tickType: "Go",
  rating: 4,
};

const sampleEntry6: Tick = {
  id: 6,
  date: "2026-04-24",
  routeName: "Abendrot",
  cragName: "Stahlberg",
  sectorName: "Zentralpfeiler",
  grade: "6a+",
  tickType: "Toprope",
  rating: 4,
};

const sampleEntries: Tick[] = [
  sampleEntry,
  sampleEntry2,
  sampleEntry3,
  sampleEntry4,
  sampleEntry6,
];

const sampleRoutes: Route[] = [
  { id: "r1", name: "Wand der Träume", grade: "7a", cragId: "c1" },
  { id: "r2", name: "Nordkante", grade: "6c+", cragId: "c1" },
  { id: "r3", name: "Morgenwind", grade: "7b", cragId: "c1" },
  { id: "r4", name: "Sonnenriss", grade: "6b", cragId: "c1" },
  { id: "r5", name: "Abendrot", grade: "6a+", cragId: "c1" },
  { id: "r6", name: "Steinerne Hand", grade: "7a", cragId: "c1" },
  { id: "r7", name: "Falkenflug", grade: "6c", cragId: "c1" },
  { id: "r8", name: "Mondsichel", grade: "7a+", cragId: "c1" },
  { id: "r9", name: "Risskante", grade: "6b", cragId: "c1" },
  { id: "r10", name: "Drachenkamm", grade: "8a", cragId: "c1" },
  { id: "r11", name: "Stille Verschneidung", grade: "5c", cragId: "c1" },
  { id: "r12", name: "Heißer Tanz", grade: "7b+", cragId: "c1" },
];

const sampleCrag: Crag = {
  id: "c1",
  name: "Herzogenreuther Wand",
  latitude: 49.74,
  longitude: 11.36,
  approachTime: 15,
  routes: sampleRoutes,
};

const sampleCragEmpty: Crag = {
  id: "c2",
  name: "Neuentdeckter Block",
  latitude: 49.81,
  longitude: 11.42,
  routes: [],
};

type ShowcaseSection = {
  title: string;
  description: string;
  content: ReactNode;
};

const showcaseSections: ShowcaseSection[] = [
  {
    title: "Buttons",
    description: "Alle visuellen Button-Varianten aus dem aktuellen PWA-Set.",
    content: (
      <div className="flex flex-wrap gap-3">
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Ghost" variant="ghost" />
      </div>
    ),
  },
  {
    title: "Ticklist Entry",
    description:
      "Typische Logbuch-Eintraege aus der Fraenkischen Schweiz mit den Tick-Typen der App.",
    content: (
      <div className="max-w-2xl space-y-3">
        {sampleEntries.map((entry) => (
          <TicklistEntry key={entry.id} tick={entry} />
        ))}
      </div>
    ),
  },
  {
    title: "Crag Routes Display",
    description:
      "Verteilung der Routen eines Crags nach Schwierigkeitsgrad als Bar-Chart.",
    content: (
      <div className="max-w-2xl">
        <CragRoutesDisplay routes={sampleRoutes} />
      </div>
    ),
  },
  {
    title: "Crag Popup",
    description:
      "Kompaktes Map-Popup mit Stats-Header und Mini-Verteilung. Rechts: Empty-State ohne erfasste Routen.",
    content: (
      <div className="flex flex-wrap items-start gap-6">
        <CragPopup crag={sampleCrag} />
        <CragPopup crag={sampleCragEmpty} />
      </div>
    ),
  },
  {
    title: "Navbar",
    description:
      "Die Bottom-Navigation der App bleibt global im Layout sichtbar.",
    content: (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600 shadow-sm">
        Die Navbar ist im Layout verankert und wird auf allen Hauptseiten
        automatisch mitgerendert.
      </div>
    ),
  },
];

export default function StylePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
          Styleguide
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Komponenten-Übersicht
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          Diese Seite ist der zentrale Ort, um alle wiederverwendbaren
          Komponenten der PWA zu sammeln und visuell zu prüfen. Neue Komponenten
          kommen einfach als neue Sektion in diese Liste dazu.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-900">
            Pflege-Regel
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Wenn du eine neue Komponente anlegst, ergänze hier direkt eine
            Vorschau samt kurzer Beschreibung. So bleibt der Überblick zentral
            und du siehst Styling, Abstände und Zustände an einem Ort.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-900">Route</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Die Seite erreichst du unter{" "}
            <span className="font-medium text-stone-800">/styleguide</span>. Sie
            ist bewusst nicht Teil der Bottom-Navigation, damit die
            Hauptnavigation für die App-Features sauber bleibt.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {showcaseSections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-stone-900">
                {section.title}
              </h2>
              <p className="text-sm leading-6 text-stone-600">
                {section.description}
              </p>
            </div>
            <div className="mt-5">{section.content}</div>
          </article>
        ))}
      </section>
    </div>
  );
}
