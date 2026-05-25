import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import { courseMatchesPool } from "./pool-helpers.ts";
import type { z } from "zod";
import type { AggregateCreditsSchema } from "../../schemas/program.ts";

type AggregateCreditsRequirement = z.infer<typeof AggregateCreditsSchema>;

/**
 * Aggregate constraint — counts credits matching the pool across the ENTIRE
 * degree (consumed + unclaimed). Does NOT mark anything consumed.
 * This is a degree-wide constraint, not a bucket.
 */
export function evaluateAggregateCredits(
  ctx: EvaluatorContext,
  req: AggregateCreditsRequirement,
): RequirementResult {
  const matched: string[] = [];
  let creditsApplied = 0;

  for (const course of ctx.courses) {
    if (!courseMatchesPool(course.course, req.pool)) continue;
    matched.push(course.course);
    creditsApplied += course.credits;
  }

  if (creditsApplied >= req.credits) {
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: matched,
      creditsApplied,
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits across degree`,
    };
  }

  if (creditsApplied > 0) {
    return {
      status: "partial",
      requirementId: req.id,
      label: req.label,
      coursesMatched: matched,
      creditsApplied,
      creditsNeeded: req.credits - creditsApplied,
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits across degree`,
      missing: `${req.credits - creditsApplied} more qualifying credits`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: 0/${req.credits} credits`,
    missing: `${req.credits} credits matching pool`,
  };
}
