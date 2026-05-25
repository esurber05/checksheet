import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import type { z } from "zod";
import type { FreeCreditsSchema } from "../../schemas/program.ts";

type FreeCreditsRequirement = z.infer<typeof FreeCreditsSchema>;

/**
 * Mop-up bucket — accepts any remaining unclaimed credits.
 * Runs last in the dispatcher's tier order so specific requirements
 * have already claimed what they need.
 */
export function evaluateFreeCredits(
  ctx: EvaluatorContext,
  req: FreeCreditsRequirement,
): RequirementResult {
  let creditsApplied = 0;
  const claimed: string[] = [];

  for (const course of ctx.courses) {
    if (creditsApplied >= req.credits) break;
    if (course.consumed) continue;
    course.consumed = true;
    course.consumedBy = `${ctx.currentGroupId}:${req.id}`;
    creditsApplied += course.credits;
    claimed.push(course.course);
  }

  if (creditsApplied >= req.credits) {
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: claimed,
      creditsApplied,
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} free credits satisfied`,
    };
  }

  if (creditsApplied > 0) {
    return {
      status: "partial",
      requirementId: req.id,
      label: req.label,
      coursesMatched: claimed,
      creditsApplied,
      creditsNeeded: req.credits - creditsApplied,
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} free credits`,
      missing: `${req.credits - creditsApplied} more credits (any subject)`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no remaining credits available`,
    missing: `${req.credits} credits (any subject)`,
  };
}
