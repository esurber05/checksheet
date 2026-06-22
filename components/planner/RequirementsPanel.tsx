"use client";

import { useState, useEffect, useTransition } from "react";
import { recomputeAudit } from "@/app/plan/[studentId]/actions.ts";
import type { CourseEntry } from "@/lib/schemas/student.ts";
import type { GroupResult } from "@/lib/engine/index.ts";

type Props = {
  studentId: string;
  programId: string;
  initialGroupResults: GroupResult[];
  courseRecord: CourseEntry[];
};

function groupProgress(group: GroupResult): { satisfied: number; total: number } {
  const satisfied = group.requirementResults.filter((r) => r.status === "satisfied").length;
  return { satisfied, total: group.requirementResults.length };
}

function ProgressBar({
  group,
  pending,
}: {
  group: GroupResult;
  pending: boolean;
}) {
  let pct: number;
  if (group.creditTarget && group.creditTarget > 0) {
    pct = Math.min(100, (group.creditsApplied / group.creditTarget) * 100);
  } else {
    const { satisfied, total } = groupProgress(group);
    pct = total > 0 ? (satisfied / total) * 100 : 0;
  }

  const { satisfied, total } = groupProgress(group);

  return (
    <div className={`space-y-1.5 transition-opacity duration-200 ${pending ? "opacity-50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wide leading-none">
          {group.label}
        </span>
        {group.creditTarget ? (
          <span className="font-mono text-[10px] tabular-nums text-stone-400">
            {group.creditsApplied} / {group.creditTarget} cr
          </span>
        ) : null}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            group.satisfied ? "bg-maroon" : pct > 0 ? "bg-maroon/60" : "bg-stone-200"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-stone-400">
          {satisfied} / {total} requirement{total !== 1 ? "s" : ""} met
        </span>
        <button className="text-[10px] text-maroon/50 hover:text-maroon transition-colors">
          View all
        </button>
      </div>
    </div>
  );
}

export default function RequirementsPanel({
  studentId,
  programId,
  initialGroupResults,
  courseRecord,
}: Props) {
  const [groupResults, setGroupResults] = useState<GroupResult[]>(initialGroupResults);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const updated = await recomputeAudit(studentId, courseRecord);
          setGroupResults(updated);
        } catch (err) {
          console.error("[RequirementsPanel] recomputeAudit failed:", err);
        }
      });
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseRecord]);

  return (
    <aside className="w-[340px] shrink-0 bg-white border-r border-stone-200 flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-stone-100">
        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-0.5">
          Requirements
        </p>
        <h2 className="font-serif text-sm font-semibold text-stone-800">Plan 1</h2>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {groupResults.map((group) => (
          <ProgressBar key={group.groupId} group={group} pending={isPending} />
        ))}
        {groupResults.length === 0 && (
          <p className="text-xs text-stone-400 text-center py-8">
            No requirement data available.
          </p>
        )}
      </div>
    </aside>
  );
}
