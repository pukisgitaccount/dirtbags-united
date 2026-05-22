import type { Crag } from "../domain/crag";
import { GRADE_ORDER, gradeIndex } from "../domain/grade";
import CragRoutesDisplay from "./CragRoutesDisplay";
import Stat from "./Stat";

export default function CragPopup({ crag }: { crag: Crag }) {
  const routes = crag.routes ?? [];
  console.log(routes);
  const sortedIndices = routes
    .map((r) => gradeIndex(r.grade))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b);

  const minGrade = sortedIndices.length ? GRADE_ORDER[sortedIndices[0]] : null;
  const maxGrade = sortedIndices.length
    ? GRADE_ORDER[sortedIndices[sortedIndices.length - 1]]
    : null;
  const medianGrade = sortedIndices.length
    ? GRADE_ORDER[sortedIndices[Math.floor(sortedIndices.length / 2)]]
    : null;

  return (
    <a href={`/crags/${crag.id}`} className="block w-72">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm">
        <h3 className="text-base font-semibold text-stone-900">{crag.name}</h3>

        <p className="mt-1 text-xs text-stone-600">
          <Stat className="font-semibold">{routes.length}</Stat> Routen
          {minGrade && maxGrade && (
            <>
              {" · "}
              <Stat>
                {minGrade}–{maxGrade}
              </Stat>
            </>
          )}
          {crag.approachTime != null && (
            <>
              {" · ↗ "}
              <Stat>{crag.approachTime}</Stat>min
            </>
          )}
        </p>

        <div className="mt-3">
          {routes.length > 0 ? (
            <CragRoutesDisplay routes={routes} compact />
          ) : (
            <p className="text-xs italic text-stone-500">
              Noch keine Routen erfasst.
            </p>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between text-xs text-stone-500">
          <span>
            {medianGrade && (
              <>
                Median <Stat>{medianGrade}</Stat>
              </>
            )}
          </span>
          <span className="font-medium text-stone-700">Details →</span>
        </div>
      </div>
    </a>
  );
}
