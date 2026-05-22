import type { Tick } from "../domain/tick";
import Stat from "./Stat";

const tickTypeColors = {
  Rotpunkt: "bg-red-500/20 text-red-600 inset-ring inset-ring-red-500/20",
  Flash: "bg-yellow-500/20 text-yellow-600 inset-ring inset-ring-yellow-500/20",
  Onsight:
    "bg-purple-500/20 text-purple-600 inset-ring inset-ring-purple-500/20",
  Toprope: "bg-blue-500/20 text-blue-600 inset-ring inset-ring-blue-500/20",
  Go: "bg-green-500/20 text-green-600 inset-ring inset-ring-green-500/20",
};

export default function TicklistEntry({ tick }: { tick: Tick }) {
  return (
    <div
      key={tick.id}
      className="bg-stone-50 rounded-lg shadow-sm border border-stone-200 p-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-stone-900 font-medium flex-1">{tick.routeName}</h3>
        <span className="px-2 py-1 bg-stone-200 text-stone-900 rounded-full text-xs font-medium">
          <Stat>{tick.grade}</Stat>
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${tickTypeColors[tick.tickType]}`}
        >
          {tick.tickType}
        </span>
      </div>

      <p className="text-xs text-stone-500">
        <Stat>
          {new Date(tick.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Stat>{" "}
        • {tick.cragName}
      </p>
    </div>
  );
}
