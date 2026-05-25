import type { EvaluatorContext, RequirementResult, AuditCourse } from "../audit-result.ts";
import { lookupGrade } from "../audit-result.ts";
import { meetsMinGrade } from "../../schemas/student.ts";
import type { z } from "zod";
import type { ExactCourseSchema } from "../../schemas/program.ts";

type ExactRequirement = z.infer<typeof ExactCourseSchema>;

export function evaluateExact(ctx: EvaluatorContext, req: ExactRequirement): RequirementResult {
  // Build the set of acceptable course codes (primary + substitutes + advisor-approved swaps).
  const candidates = new Set([req.course, ...req.substitutes]);
  for (const approval of ctx.approvals) {
    if (
      approval.type === "substitution" &&
      approval.forRequirement === req.id &&
      approval.withCourse
    ) {
      candidates.add(approval.withCourse);
    }
  }

  // Find the first claimable match.
  let match: AuditCourse | undefined;
  for (const course of ctx.courses) {
    if (!candidates.has(course.course)) continue;
    // noDoubleCounting bypasses allow-rules — strict single-claim only.
    const claimable = req.noDoubleCounting ? !course.consumed : ctx.canClaim(course);
    if (claimable) {
      match = course;
      break;
    }
  }

  if (!match) {
    const needed = [...candidates].join(" or ");
    return {
      status: "unsatisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: [],
      creditsApplied: 0,
      message: `${req.label ?? req.id}: not completed`,
      missing: needed,
    };
  }

  // Grade check — skip for transfer (no VT grade) and in-progress (no grade yet).
  if (req.minGrade && match.source === "completed") {
    const grade = lookupGrade(ctx.student, match.course);
    if (grade !== null && !meetsMinGrade(grade, req.minGrade)) {
      return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [match.course],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: grade ${grade} does not meet minimum ${req.minGrade}`,
        missing: `${match.course} with grade ≥ ${req.minGrade}`,
      };
    }
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
}
