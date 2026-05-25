import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import type { z } from "zod";
import type { ZeroCreditSchema } from "../../schemas/program.ts";

type ZeroCreditRequirement = z.infer<typeof ZeroCreditSchema>;

/**
 * Zero-credit courses must appear on the transcript but
 * carry no credit weight.
 */
export function evaluateZeroCredit(
  ctx: EvaluatorContext,
  req: ZeroCreditRequirement,
): RequirementResult {
  // Accept the course regardless of consumed status
  const onTranscript = ctx.courses.some((c) => c.course === req.course);

  // Also accept a waiver approval
  const waived = ctx.approvals.some(
    (a) => a.type === "waiver" && a.forRequirement === req.id,
  );

  if (onTranscript || waived) {
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: [req.course],
      creditsApplied: 0,
      message: waived
        ? `${req.label ?? req.id}: waived by advisor`
        : `${req.label ?? req.id}: ${req.course} on transcript`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: ${req.course} not on transcript`,
    missing: req.course,
  };
}
