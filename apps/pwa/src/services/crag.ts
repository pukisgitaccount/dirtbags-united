import type { Database } from "../domain/database.types";
import type { Crag } from "../domain/crag";
import type { Route } from "../domain/route";

type CragRow = Database["public"]["Tables"]["crags"]["Row"];

export function mapCragFromDatabaseRow(row: CragRow, routes?: Route[]): Crag {
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    description: row.description ?? undefined,
    parkingLatitude: row.parking_latitude ?? undefined,
    parkingLongitude: row.parking_longitude ?? undefined,
    approachTime: row.approach_time ?? undefined,
    routes,
  };
}
