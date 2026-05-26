import type { AuditResult } from "@/lib/engine/audit-result.ts";

export default function ProgressPanel({ audit }: { audit: AuditResult }) {
  const { summary, gpaChecks, eligible } = audit;
  const pct = Math.min(
    100,
    Math.round((summary.totalCreditsApplied / summary.totalCreditsRequired) * 100),
  );

  const overallGpa = gpaChecks.find((g) => g.label === "Overall GPA");
  const inMajorGpa = gpaChecks.find((g) => g.label.startsWith("In-Major"));

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-stone-600">Credits applied</span>
          <span className="font-mono tabular-nums text-sm text-stone-900">
            {summary.totalCreditsApplied} / {summary.totalCreditsRequired}
          </span>
        </div>
        <div className="relative h-2 bg-stone-100 rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-maroon rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-right mt-1 font-mono tabular-nums text-xs text-stone-600">
          {pct}%
        </p>
      </div>

      {/* GPA + eligibility row */}
      <div className="flex flex-wrap gap-6 items-center pt-1">
        {overallGpa && (
          <div>
            <span className="text-xs text-stone-600">Overall GPA </span>
            <span className="font-mono tabular-nums font-medium text-stone-900">
              {overallGpa.actual.toFixed(2)}
            </span>
          </div>
        )}
        {inMajorGpa && (
          <div>
            <span className="text-xs text-stone-600">{inMajorGpa.label} </span>
            <span className="font-mono tabular-nums font-medium text-stone-900">
              {inMajorGpa.actual.toFixed(2)}
            </span>
          </div>
        )}
        <div className="ml-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              eligible
                ? "bg-green-50 text-success border-green-200"
                : "bg-stone-100 text-stone-600 border-stone-200"
            }`}
          >
            {eligible ? "Eligible to graduate" : "Not yet eligible"}
          </span>
        </div>
      </div>
    </div>
  );
}
