import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

import MapLibre from "../components/MapLibre";
import MapSearchBar from "../components/MapSearchBar";
import type { Crag } from "../domain/crag";

import { mapCragFromDatabaseRow } from "../services/crag";
import { mapRouteFromDatabaseRow } from "../services/route";

const center: [number, number] = [11.1, 49.9];

console.log(supabase);

export default function MapPage() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchedCrags, setFetchedCrags] = useState<Crag[]>([]);

  useEffect(() => {
    const fetchCrags = async () => {
      const { data, error } = await supabase
        .from("crags")
        .select("*, routes(*)");
      if (error) {
        setFetchError(error.message);
        //reset in case of error to avoid showing stale data
        setFetchedCrags([]);
      } else {
        setFetchedCrags(
          data.map((row) => {
            const { routes, ...cragRow } = row;
            return mapCragFromDatabaseRow(
              cragRow,
              routes.map((r) => mapRouteFromDatabaseRow(r)),
            );
          }),
        );
        setFetchError(null);
      }
    };

    fetchCrags();
  }, []);

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <MapSearchBar />
      {fetchError && (
        <div className="p-4 bg-red-100 text-red-700">
          Failure to load crags. Sorry!
          {fetchError}
        </div>
      )}
      {fetchedCrags && <MapLibre initialCenter={center} crags={fetchedCrags} />}
    </div>
  );
}
