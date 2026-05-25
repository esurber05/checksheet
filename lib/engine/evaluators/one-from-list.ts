import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import type { z } from "zod";
import type { OneFromListSchema } from "../../schemas/program.ts";

type OneFromListRequirement = z.infer<typeof OneFromListSchema>;

export function evaluateOneFromList(
  ctx: EvaluatorContext,
  req: OneFromListRequirement,
): RequirementResult {
  for (const code of req.courses) {
    const match = ctx.courses.find((c) => c.course === code && ctx.canClaim(c));
    if (!match) continue;

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
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: none of the listed courses completed`,
    missing: req.courses.join(", "),
  };
}
