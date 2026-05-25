import type { EvaluatorContext, RequirementResult, AuditCourse } from "../audit-result.ts";
import type { z } from "zod";
import type { ChooseNFromGroupsSchema } from "../../schemas/program.ts";

type ChooseNFromGroupsRequirement = z.infer<typeof ChooseNFromGroupsSchema>;

/** Returns all combinations of size k from arr. */
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map((c) => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export function evaluateChooseNFromGroups(
  ctx: EvaluatorContext,
  req: ChooseNFromGroupsRequirement,
): RequirementResult {
  // For each group, find which courses are claimable.
  const availableByGroup = req.groups.map((group) => ({
    group,
    available: ctx.courses.filter(
      (c) => group.courses.includes(c.course) && ctx.canClaim(c),
    ),
  }));

  // Try combinations of groupsToChoose groups and pick the first where
  // each group has enough available courses.
  const groupCombos = combinations(availableByGroup, req.groupsToChoose);

  let chosenCombo: typeof availableByGroup | null = null;
  for (const combo of groupCombos) {
    if (combo.every((g) => g.available.length >= req.coursesPerGroup)) {
      chosenCombo = combo;
      break;
    }
  }

  if (chosenCombo !== null) {
    const claimed: AuditCourse[] = [];
    for (const { available } of chosenCombo) {
      let taken = 0;
      for (const course of available) {
        if (taken >= req.coursesPerGroup) break;
        course.consumed = true;
        course.consumedBy = `${ctx.currentGroupId}:${req.id}`;
        claimed.push(course);
        taken++;
      }
    }
    const creditsApplied = claimed.reduce((sum, c) => sum + c.credits, 0);
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: claimed.map((c) => c.course),
      creditsApplied,
      message: `${req.label ?? req.id}: satisfied (${req.groupsToChoose} groups × ${req.coursesPerGroup} courses)`,
    };
  }

  // Count how many groups have enough.
  const groupsSatisfiable = availableByGroup.filter(
    (g) => g.available.length >= req.coursesPerGroup,
  ).length;

  if (groupsSatisfiable > 0) {
    return {
      status: "partial",
      requirementId: req.id,
      label: req.label,
      coursesMatched: [],
      creditsApplied: 0,
      creditsNeeded: req.credits,
      message: `${req.label ?? req.id}: ${groupsSatisfiable}/${req.groupsToChoose} groups satisfiable`,
      missing: `${req.groupsToChoose - groupsSatisfiable} more groups with ≥ ${req.coursesPerGroup} courses each`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no distributional groups satisfied`,
    missing: `${req.groupsToChoose} groups with ≥ ${req.coursesPerGroup} courses each`,
  };
}
