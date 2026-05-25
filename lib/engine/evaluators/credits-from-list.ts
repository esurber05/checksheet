import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import type { z } from "zod";
import type { CreditsFromListSchema } from "../../schemas/program.ts";

type CreditsFromListRequirement = z.infer<typeof CreditsFromListSchema>;

export function evaluateCreditsFromList(
  ctx: EvaluatorContext,
  req: CreditsFromListRequirement,
): RequirementResult {
  let creditsApplied = 0;
  const claimed: string[] = [];

  for (const code of req.courses) {
    if (creditsApplied >= req.credits) break;
    const match = ctx.courses.find((c) => c.course === code && ctx.canClaim(c));
    if (!match) continue;
    match.consumed = true;
    match.consumedBy = `${ctx.currentGroupId}:${req.id}`;
    creditsApplied += match.credits;
    claimed.push(match.course);
  }

  const meetsMinCourses = req.minCourses === undefined || claimed.length >= req.minCourses;

  if (creditsApplied >= req.credits && meetsMinCourses) {
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: claimed,
      creditsApplied,
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits satisfied`,
    };
  }

  if (!meetsMinCourses) {
    return {
      status: "unsatisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: claimed,
      creditsApplied,
      message: `${req.label ?? req.id}: only ${claimed.length} courses (need ≥ ${req.minCourses})`,
      missing: `${req.minCourses! - claimed.length} more courses from the list`,
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
      message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits`,
      missing: `${req.credits - creditsApplied} more credits from the approved list`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no matching courses completed`,
    missing: `${req.credits} credits from the approved list`,
  };
}
