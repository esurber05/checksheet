import type { GroupResult } from "@/lib/engine/audit-result.ts";
import RequirementRow from "./RequirementRow.tsx";

export default function RequirementGroup({
  group,
  courseTitles,
}: {
  group: GroupResult;
  courseTitles: Record<string, string>;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="font-serif text-2xl font-semibold text-stone-900">
          {group.label}
        </h2>
        {group.creditTarget !== undefined && (
          <span className="font-mono tabular-nums text-sm text-stone-600">
            {group.creditsApplied} / {group.creditTarget} cr
          </span>
        )}
      </div>
      <hr className="border-stone-200 mb-4" />
      <div className="space-y-1">
        {group.requirementResults.map((result) => (
          <RequirementRow key={result.requirementId} result={result} courseTitles={courseTitles} />
        ))}
      </div>
    </section>
  );
}
