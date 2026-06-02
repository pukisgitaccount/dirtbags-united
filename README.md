# dirtbags-united

Community-based climbing app/website to create topos and make them available and free for everyone.

## Struktur

Das Projekt nutzt npm Workspaces.

Struktur (aktuell):

dirtbags-united/

- apps/
  - api/
    - src/
  - pwa/
    - public/
    - src/
      - assets/
      - components/
- packages/

## Installierte Pakete (aktuell)

### apps/api

Dependencies:

- express

DevDependencies:

- @types/express

### apps/pwa

Dependencies:

- react
- react-dom
- tailwindscss

DevDependencies:

- @eslint/js
- @tailwindcss/vite
- @types/node
- @types/react
- @types/react-dom
- @vitejs/plugin-react
- eslint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- tailwindcss
- typescript
- typescript-eslint
- vite

## Run Dev Servers:

`npm run dev:pwa` for Frontend
`npm run dev:api` for Backend

## Styleguide:

Styleguide is reachable under `/styleguide`

## Database:

Using Supabase als DB. Schema-Änderungen passieren über Migrationen (file-based), Quelle der Wahrheit ist `supabase/migrations/`.

### Migrationen

- Neue Migration: `supabase migration new <name>` (legt eine leere SQL-Datei mit Timestamp an)
- Migrationen sind nach dem Push **immutable** — Änderungen am Schema = neue Migration, nicht alte Datei editieren

#### Zwei Wege, eine Migration anzuwenden: lokal (Docker) vs. Cloud

Es gibt zwei getrennte Datenbanken, und der Befehl entscheidet, welche getroffen wird:

| Befehl | Trifft welche DB? | Docker nötig? |
| --- | --- | --- |
| `supabase start` + `supabase migration up` | **lokale** Sandbox auf dem eigenen Rechner | **ja** |
| `supabase db push` | das **echte, gehostete** Cloud-Projekt (dieselbe DB wie die laufende App) | **nein** |

- **`supabase start`** baut eine komplette lokale Supabase-Kopie (Postgres, Auth, Storage) in **Docker**-Containern. Ohne laufendes Docker schlägt es fehl (`Cannot connect to the Docker daemon`). Zum gefahrlosen Testen — `supabase db reset` setzt sie jederzeit zurück.
- **`supabase db push`** braucht kein Docker, sondern nur `supabase login` + `supabase link`, und schreibt die Migrationen direkt in die Cloud-DB. **Vorsicht:** trifft das Live-Projekt; ein fehlerhafter Trigger auf `auth.users` kann echte Anmeldungen blockieren. Schema-Änderungen rund um Auth daher am besten erst lokal (Docker) testen.

### TypeScript-Types aus dem DB-Schema

Die Datei `apps/pwa/src/domain/database.types.ts` wird **automatisch generiert** und enthält die exakten Row-/Insert-/Update-Types aller Tabellen. Nicht von Hand bearbeiten — bei Schema-Änderungen neu generieren:

```bash
supabase gen types typescript --linked > apps/pwa/src/domain/database.types.ts   # gegen Cloud-DB
supabase gen types typescript --local  > apps/pwa/src/domain/database.types.ts   # gegen lokale Docker-DB
```

`--linked` liest das Schema der Cloud-DB, `--local` das der lokalen Docker-Instanz — passend dazu, wo du die Migration angewendet hast.

## Domain Layer (`apps/pwa/src/domain/`)

Hier liegen die **idealisierten** App-Models — wie der Frontend-Code mit Daten arbeiten möchte. Diese Types sind unabhängig vom DB-Schema (camelCase, optionale Felder, ggf. verschachtelte Strukturen wie `sectors: Sector[]`).

- `crag.ts`, `sector.ts`, `route.ts`, `tick.ts` — handgepflegte Domain-Interfaces
- `database.types.ts` — generierte DB-Row-Types (snake_case, exakt wie Postgres)

Domain-Types und DB-Row-Types sind **bewusst getrennt**: ändert sich das DB-Schema, ändert sich nur der Mapper, nicht jede UI-Komponente.

## Services Layer (`apps/pwa/src/services/`)

Vermittelt zwischen DB und Domain. Jeder Service kapselt:

- DB-Zugriffe (über den Supabase-Client aus `utils/supabase.ts`)
- **Mapper-Funktionen**, die DB-Rows in Domain-Objekte übersetzen (z. B. `mapCragFromDatabaseRow` in `services/crag.ts`)

UI-Komponenten sollten **nicht direkt** `supabase.from(...)` aufrufen, sondern Service-Funktionen verwenden — so bleibt der Übersetzungs-Code an einer Stelle.
