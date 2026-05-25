import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import type { CompoundRequirement } from "../../schemas/program.ts";

/**
 * Compound requirement — stub.
 *
 * TO IMPLEMENT:
 *
 * A compound requirement has a credit target AND multiple sub-requirements
 * that must all be satisfied simultaneously using courses from the same pool.
 * Courses within the compound CAN satisfy multiple sub-requirements at once
 * (unlike inter-group double-counting, which is forbidden by default).
 *
 * Suggested algorithm:
 *
 * 1. Identify all courses eligible for this compound (union of all courses
 *    eligible for any sub-requirement). Don't consume them yet.
 *
 * 2. Run a tentative-claim pass: build a local copy of the eligible courses
 *    marked as tentatively consumed, then call each sub-evaluator against
 *    this local view.
 *
 * 3. If all sub-requirements are satisfied AND total credits >= req.credits:
 *    finalize (set consumed = true on the actual ctx.courses entries).
 *    Otherwise, roll back (don't touch ctx.courses).
 *
 * 4. Apply `req.caps` after filling: for each cap, sum credits from courses
 *    matching the cap's `appliesTo` predicate and enforce the maxCredits cap.
 *
 * 5. The `predicate` variant of `appliesTo` is a string expression intended
 *    for future evaluation (e.g., "level >= 3000"). For now, treat it as a
 *    no-op and document the gap.
 *
 * Note: compound sub-requirements may themselves be any RequirementType,
 * including nested compound (via z.lazy). Dispatch via the same evaluator
 * dispatch table used in the dispatcher to handle this recursively.
 */
export function evaluateCompound(
  ctx: EvaluatorContext,
  req: CompoundRequirement,
): RequirementResult {
  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: compound evaluator not yet implemented`,
    missing: `${req.credits} credits satisfying all sub-requirements`,
  };
}
