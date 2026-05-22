import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Route } from "../domain/route";
import { GRADE_ORDER, gradeColor, gradeIndex } from "../domain/grade";
import Stat from "./Stat";

type CragRoutesDisplayProps = {
  routes: Route[];
  compact?: boolean;
};

const MONO_FAMILY = "ui-monospace, SFMono-Regular, Menlo, monospace";

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export default function CragRoutesDisplay({
  routes,
  compact = false,
}: CragRoutesDisplayProps) {
  const gradeCounts = routes.reduce<Record<string, number>>((acc, route) => {
    acc[route.grade] = (acc[route.grade] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(gradeCounts)
    .map(([grade, count]) => ({ grade, count }))
    .sort((a, b) => gradeIndex(a.grade) - gradeIndex(b.grade));

  const minGrade = data[0]?.grade;
  const maxGrade = data[data.length - 1]?.grade;
  const medianIdx = median(
    routes.map((r) => gradeIndex(r.grade)).filter((i) => i !== -1),
  );
  const medianGrade = medianIdx !== null ? GRADE_ORDER[medianIdx] : null;

  const chart = (
    <div className={compact ? "w-full h-20" : "w-full h-48"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={
            compact
              ? { top: 0, right: 0, left: 0, bottom: 0 }
              : { top: 4, right: 4, left: -16, bottom: 0 }
          }
        >
          {!compact && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#a8a29e"
              strokeOpacity={0.5}
              vertical={false}
            />
          )}
          <XAxis
            dataKey="grade"
            tick={{
              fontSize: compact ? 10 : 11,
              fill: "#78716c",
              fontFamily: MONO_FAMILY,
            }}
            axisLine={{ stroke: "#e7e5e4" }}
            tickLine={false}
            interval={compact ? "preserveStartEnd" : 0}
          />
          {!compact && (
            <YAxis
              tick={{
                fontSize: 11,
                fill: "#a8a29e",
                fontFamily: MONO_FAMILY,
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={32}
            />
          )}
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.grade} fill={gradeColor(entry.grade)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (compact) return chart;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h3 className="text-sm font-medium text-stone-600">
          Verteilung nach Grad
        </h3>
        {data.length > 0 && (
          <div className="text-right leading-tight">
            <div className="text-xs text-stone-700">
              <Stat className="font-semibold">{routes.length}</Stat> Routen ·{" "}
              <Stat>
                {minGrade}–{maxGrade}
              </Stat>
            </div>
            {medianGrade && (
              <div className="text-[11px] text-stone-500 mt-0.5">
                Median <Stat>{medianGrade}</Stat>
              </div>
            )}
          </div>
        )}
      </div>
      {chart}
    </div>
  );
}
