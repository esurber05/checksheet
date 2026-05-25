import { Check, CircleDashed } from "lucide-react";
import type { RequirementResult } from "@/lib/engine/audit-result.ts";

function borderClass(status: RequirementResult["status"]) {
  if (status === "satisfied") return "border-l-2 border-success";
  if (status === "partial") return "border-l-2 border-burnt";
  return "border-l-2 border-stone-200";
}

function StatusIcon({ status }: { status: RequirementResult["status"] }) {
  if (status === "satisfied")
    return <Check size={14} className="text-success shrink-0 mt-0.5" />;
  if (status === "partial")
    return <CircleDashed size={14} className="text-burnt shrink-0 mt-0.5" />;
  return (
    <span className="text-stone-400 text-sm leading-none mt-0.5 w-3.5 text-center">
      —
    </span>
  );
}

export default function RequirementRow({ result }: { result: RequirementResult }) {
  const isSatisfied = result.status === "satisfied";
  const isPartial = result.status === "partial";

  return (
    <div className={`flex items-start gap-3 pl-3 py-2 ${borderClass(result.status)}`}>
      <StatusIcon status={result.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-sm text-stone-900">
              {result.label ?? result.requirementId}
            </span>
            {result.coursesMatched.length > 0 && (
              <span className="text-xs text-stone-500 font-mono">
                {result.coursesMatched.join(", ")}
              </span>
            )}
          </div>
          <div className="shrink-0 text-right">
            {isSatisfied && result.creditsApplied > 0 && (
              <span className="font-mono tabular-nums text-sm text-stone-600">
                {result.creditsApplied} cr
              </span>
            )}
            {isPartial && (
              <span className="font-mono tabular-nums text-sm text-burnt">
                {result.creditsApplied} /{" "}
                {result.creditsApplied + result.creditsNeeded} cr
              </span>
            )}
          </div>
        </div>
        {result.status === "unsatisfied" && result.missing && (
          <p className="text-xs text-stone-500 mt-0.5 truncate">{result.missing}</p>
        )}
        {isPartial && result.missing && (
          <p className="text-xs text-stone-500 mt-0.5">{result.missing}</p>
        )}
      </div>
    </div>
  );
}
