import type { EvaluatorContext, RequirementResult, AuditCourse } from "../audit-result.ts";
import { lookupGrade } from "../audit-result.ts";
import { meetsMinGrade } from "../../schemas/student.ts";
import type { z } from "zod";
import type { OneOfSchema } from "../../schemas/program.ts";

type OneOfRequirement = z.infer<typeof OneOfSchema>;

export function evaluateOneOf(ctx: EvaluatorContext, req: OneOfRequirement): RequirementResult {
  for (const option of req.options) {
    if ("course" in option) {
      // Single-course option.
      const match = ctx.courses.find(
        (c) => c.course === option.course && ctx.canClaim(c),
      );
      if (!match) continue;

      // Grade check.
      if (req.minGrade && match.source === "completed") {
        const grade = lookupGrade(ctx.student, match.course);
        if (grade !== null && !meetsMinGrade(grade, req.minGrade)) continue;
      }

      match.consumed = true;
      match.consumedBy = `${ctx.currentGroupId}:${req.id}`;

      return {
        status: "satisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [match.course],
        creditsApplied: match.credits,
        message: `${req.label ?? req.id}: satisfied by ${match.course}`,
      };
    } else {
      // Sequence option — atomic: all courses must be claimable.
      const sequenceMatches: AuditCourse[] = [];
      let allFound = true;

      for (const code of option.sequence) {
        const found = ctx.courses.find((c) => c.course === code && ctx.canClaim(c));
        if (!found) { allFound = false; break; }
        sequenceMatches.push(found);
      }

      if (!allFound) continue;

      // Grade check on the first course in the sequence (sequences rarely have minGrade,
      // but honor it if set).
      if (req.minGrade) {
        const firstCompleted = sequenceMatches.find((m) => m.source === "completed");
        if (firstCompleted) {
          const grade = lookupGrade(ctx.student, firstCompleted.course);
          if (grade !== null && !meetsMinGrade(grade, req.minGrade)) continue;
        }
      }

      for (const m of sequenceMatches) {
        m.consumed = true;
        m.consumedBy = `${ctx.currentGroupId}:${req.id}`;
      }

      const creditsApplied = sequenceMatches.reduce((sum, m) => sum + m.credits, 0);

      return {
        status: "satisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: sequenceMatches.map((m) => m.course),
        creditsApplied,
        message: `${req.label ?? req.id}: satisfied by ${sequenceMatches.map((m) => m.course).join(" + ")}`,
      };
    }
  }

  // No option satisfied.
  const optionLabels = req.options
    .map((o) => ("course" in o ? o.course : o.sequence.join(" + ")))
    .join(" | ");

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no option satisfied`,
    missing: optionLabels,
  };
}
