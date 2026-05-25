import type { EvaluatorContext, RequirementResult, AuditCourse } from "../audit-result.ts";
import type { z } from "zod";
import type { CourseSequenceSchema } from "../../schemas/program.ts";

type CourseSequenceRequirement = z.infer<typeof CourseSequenceSchema>;

/**
 * All courses in the sequence must be claimable — it's atomic (all or nothing).
 * Verify every course is available before marking any consumed, so a partial
 * match never leaves the pool in an inconsistent state.
 */
export function evaluateCourseSequence(
  ctx: EvaluatorContext,
  req: CourseSequenceRequirement,
): RequirementResult {
  const matches: AuditCourse[] = [];

  for (const code of req.courses) {
    const found = ctx.courses.find((c) => c.course === code && ctx.canClaim(c));
    if (!found) {
      const claimed = matches.map((m) => m.course);
      const missing = req.courses.filter((c) => !claimed.includes(c));
      return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: sequence incomplete`,
        missing: missing.join(" + "),
      };
    }
    matches.push(found);
  }

  // All found — claim atomically.
  for (const m of matches) {
    m.consumed = true;
    m.consumedBy = `${ctx.currentGroupId}:${req.id}`;
  }

  const creditsApplied = matches.reduce((sum, m) => sum + m.credits, 0);

  return {
    status: "satisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: matches.map((m) => m.course),
    creditsApplied,
    message: `${req.label ?? req.id}: satisfied by ${matches.map((m) => m.course).join(" + ")}`,
  };
}
