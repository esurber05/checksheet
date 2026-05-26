/**
 * Audit Dispatcher — orchestrates the full degree audit.
 */

import type { Program, RequirementType, DoubleCountRule } from "../schemas/program.ts";
import type { StudentRecord } from "../schemas/student.ts";
import { effectiveCourses, overallGPA, inMajorGPA } from "../schemas/student.ts";

import type {
  AuditCourse,
  Catalog,
  EvaluatorContext,
  RequirementResult,
  GroupResult,
  GpaCheck,
  AuditResult,
} from "./audit-result.ts";
import {
  loadCatalog,
  lookupCourse,
  coursesByPathwaysConcept,
  coursesBySubject,
  resolveAlias,
} from "../catalog.ts";

import { evaluateExact } from "./evaluators/exact.ts";
import { evaluateZeroCredit } from "./evaluators/zero-credit.ts";
import { evaluateCourseSequence } from "./evaluators/course-sequence.ts";
import { evaluateOneOf } from "./evaluators/one-of.ts";
import { evaluateOneFromList } from "./evaluators/one-from-list.ts";
import { evaluateForeignLanguage } from "./evaluators/foreign-language.ts";
import { evaluateCreditsFromList } from "./evaluators/credits-from-list.ts";
import { evaluateCreditsFromPool } from "./evaluators/credits-from-pool.ts";
import { evaluateChooseNFromGroups } from "./evaluators/choose-n-from-groups.ts";
import { evaluateAggregateCredits } from "./evaluators/aggregate-credits.ts";
import { evaluateFreeCredits } from "./evaluators/free-credits.ts";
import { evaluateCompound } from "./evaluators/compound.ts";

// Tier ordering — lower number = processed first

const TIER: Record<RequirementType["type"], number> = {
  exact: 0,
  zero_credit: 0,
  course_sequence: 0,
  one_of: 1,
  one_from_list: 1,
  foreign_language: 2,
  credits_from_list: 3,
  credits_from_pool: 4,
  choose_n_from_groups: 4,
  compound: 5,
  aggregate_credits: 6, // handled separately, post-consumption
  free_credits: 7,       // handled separately, last
};


// canClaim factory — encapsulates double-count rule logic

function buildCanClaim(currentGroupId: string, rules: DoubleCountRule[]) {
  return (course: AuditCourse): boolean => {
    if (!course.consumed) return true;

    // consumedBy format: "groupId:requirementId"
    const colonIdx = course.consumedBy?.indexOf(":") ?? -1;
    if (colonIdx === -1) return true;
    const sourceGroup = course.consumedBy!.slice(0, colonIdx);
    const sourceReqId = course.consumedBy!.slice(colonIdx + 1);

    // Same group can always re-examine (shouldn't happen in practice).
    if (sourceGroup === currentGroupId) return true;

    const pairKey = [sourceGroup, currentGroupId].sort().join("::");
    const allowRule = rules.find((r) => {
      if (r.type !== "allow") return false;
      return [...r.between].sort().join("::") === pairKey;
    });

    if (!allowRule) return false;

    // `except` contains requirement IDs that are excluded from double-counting.
    if (allowRule.except.includes(sourceReqId)) return false;

    return true;
  };
}

// Evaluator dispatch

function dispatch(ctx: EvaluatorContext, req: RequirementType): RequirementResult {
  switch (req.type) {
    case "exact":               return evaluateExact(ctx, req);
    case "zero_credit":         return evaluateZeroCredit(ctx, req);
    case "course_sequence":     return evaluateCourseSequence(ctx, req);
    case "one_of":              return evaluateOneOf(ctx, req);
    case "one_from_list":       return evaluateOneFromList(ctx, req);
    case "foreign_language":    return evaluateForeignLanguage(ctx, req);
    case "credits_from_list":   return evaluateCreditsFromList(ctx, req);
    case "credits_from_pool":   return evaluateCreditsFromPool(ctx, req);
    case "choose_n_from_groups":return evaluateChooseNFromGroups(ctx, req);
    case "aggregate_credits":   return evaluateAggregateCredits(ctx, req);
    case "free_credits":        return evaluateFreeCredits(ctx, req);
    case "compound":            return evaluateCompound(ctx, req);
  }
}

// runAudit — public entry point

export function runAudit(program: Program, student: StudentRecord): AuditResult {
  loadCatalog();
  const catalog: Catalog = { lookupCourse, coursesByPathwaysConcept, coursesBySubject, resolveAlias };

  // Build mutable AuditCourse pool, deduplicating by VT code.
  const rawCourses = effectiveCourses(student);
  const seenCodes = new Map<string, AuditCourse>();
  for (const ec of rawCourses) {
    const existing = seenCodes.get(ec.course);
    if (!existing) {
      seenCodes.set(ec.course, { ...ec, consumed: false });
    } else {
      // Prefer completed over transfer; prefer higher credit value on tie.
      const prefer =
        (ec.source === "completed" && existing.source !== "completed") ||
        ec.credits > existing.credits;
      if (prefer) seenCodes.set(ec.course, { ...ec, consumed: false });
    }
  }
  const courses: AuditCourse[] = [...seenCodes.values()];

  // Flatten all (groupId, requirement) pairs and bucket them.
  type Pair = { groupId: string; req: RequirementType };
  const tieredPairs: Pair[] = [];
  const aggregatePairs: Pair[] = [];
  const freeCreditPairs: Pair[] = [];

  for (const group of program.requirementGroups) {
    for (const req of group.requirements) {
      if (req.type === "aggregate_credits") {
        aggregatePairs.push({ groupId: group.id, req });
      } else if (req.type === "free_credits") {
        freeCreditPairs.push({ groupId: group.id, req });
      } else {
        tieredPairs.push({ groupId: group.id, req });
      }
    }
  }

  // Sort tiered pairs by tier then by original order
  tieredPairs.sort((a, b) => TIER[a.req.type] - TIER[b.req.type]);

  // Step 3: Process tiered requirements.
  const resultsByGroup = new Map<string, RequirementResult[]>();
  for (const group of program.requirementGroups) {
    resultsByGroup.set(group.id, []);
  }

  const processQueue = (pairs: Pair[]) => {
    for (const { groupId, req } of pairs) {
      const ctx: EvaluatorContext = {
        program,
        student,
        courses,
        approvals: student.advisorApprovals,
        currentGroupId: groupId,
        canClaim: buildCanClaim(groupId, program.doubleCountRules),
        catalog,
      };
      const result = dispatch(ctx, req);
      resultsByGroup.get(groupId)!.push(result);
    }
  };

  processQueue(tieredPairs);

  // aggregate_credits — post-consumption count, non-consuming
  processQueue(aggregatePairs);

  // free_credits — mop-up
  processQueue(freeCreditPairs);

  // GPA checks
  const gpaChecks: GpaCheck[] = [];

  const actualOverall = overallGPA(student);
  gpaChecks.push({
    label: "Overall GPA",
    required: program.gpaRequirements.overall,
    actual: Math.round(actualOverall * 1000) / 1000,
    passed: actualOverall >= program.gpaRequirements.overall,
  });

  if (
    program.gpaRequirements.inMajor !== undefined &&
    program.gpaRequirements.inMajorSubject
  ) {
    const actualInMajor = inMajorGPA(
      student,
      program.gpaRequirements.inMajorSubject,
      program.policies.inMajorGPAExclusions,
    );
    gpaChecks.push({
      label: `In-Major GPA (${program.gpaRequirements.inMajorSubject})`,
      required: program.gpaRequirements.inMajor,
      actual: Math.round(actualInMajor * 1000) / 1000,
      passed: actualInMajor >= program.gpaRequirements.inMajor,
    });
  }

  // Roll up GroupResults
  const groupResults: GroupResult[] = program.requirementGroups.map((group) => {
    const results = resultsByGroup.get(group.id) ?? [];
    const creditsApplied = results.reduce((sum, r) => sum + r.creditsApplied, 0);
    const satisfied = results.length > 0 && results.every((r) => r.status === "satisfied");
    return {
      groupId: group.id,
      label: group.label,
      creditTarget: group.credits,
      creditsApplied,
      satisfied,
      requirementResults: results,
    };
  });

  const eligible =
    groupResults.every((g) => g.satisfied) && gpaChecks.every((g) => g.passed);

  const allResults = groupResults.flatMap((g) => g.requirementResults);

  return {
    studentId: student.studentId,
    programId: program.programId,
    timestamp: new Date().toISOString(),
    groupResults,
    gpaChecks,
    eligible,
    summary: {
      totalCreditsApplied: groupResults.reduce((sum, g) => sum + g.creditsApplied, 0),
      totalCreditsRequired: program.totalCredits,
      groupsSatisfied: groupResults.filter((g) => g.satisfied).length,
      groupsTotal: groupResults.length,
      requirementsSatisfied: allResults.filter((r) => r.status === "satisfied").length,
      requirementsTotal: allResults.length,
    },
  };
}
