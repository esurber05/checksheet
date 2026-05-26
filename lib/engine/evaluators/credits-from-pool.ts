import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import { courseMatchesPool } from "./pool-helpers.ts";
import type { z } from "zod";
import type { CreditsFromPoolSchema } from "../../schemas/program.ts";

type CreditsFromPoolRequirement = z.infer<typeof CreditsFromPoolSchema>;

export function evaluateCreditsFromPool(
  ctx: EvaluatorContext,
  req: CreditsFromPoolRequirement,
): RequirementResult {
  // Build pathways concept map from catalog only when needed
  const pathwaysMap: Map<string, string[]> = new Map();
  if (req.pool.type === "pathways_designated") {
    for (const c of ctx.courses) {
      const catalogCourse = ctx.catalog.lookupCourse(c.course);
      if (catalogCourse) pathwaysMap.set(c.course, catalogCourse.pathwaysConcepts);
    }
  }

  let creditsApplied = 0;
  const claimed: string[] = [];

  for (const course of ctx.courses) {
    if (creditsApplied >= req.credits) break;
    if (!ctx.canClaim(course)) continue;
    if (!courseMatchesPool(course.course, req.pool, pathwaysMap)) continue;
    course.consumed = true;
    course.consumedBy = `${ctx.currentGroupId}:${req.id}`;
    creditsApplied += course.credits;
    claimed.push(course.course);
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
      missing: `${req.minCourses! - claimed.length} more courses from pool`,
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
      missing: `${req.credits - creditsApplied} more credits from pool`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no matching courses completed`,
    missing: `${req.credits} credits from pool`,
  };
}
