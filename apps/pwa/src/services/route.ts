import type { Database } from "../domain/database.types";
import type { Route } from "../domain/route";

type RouteRow = Database["public"]["Tables"]["routes"]["Row"];

export function mapRouteFromDatabaseRow(row: RouteRow): Route {
  return {
    id: row.id,
    name: row.name,
    grade: row.grade,
    cragId: row.crag_id,
    description: row.description ?? undefined,
  };
}
