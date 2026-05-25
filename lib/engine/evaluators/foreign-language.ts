import type { EvaluatorContext, RequirementResult } from "../audit-result.ts";
import { extractLevel, extractSubject } from "./pool-helpers.ts";
import type { z } from "zod";
import type { ForeignLanguageSchema } from "../../schemas/program.ts";

type ForeignLanguageRequirement = z.infer<typeof ForeignLanguageSchema>;

// Maps canonical language names to VT subject prefixes.
const LANGUAGE_PREFIXES: Record<string, string> = {
  spanish: "SPAN",
  french: "FR",
  german: "GERM",
  italian: "ITAL",
  chinese: "CHN",
  japanese: "JAPN",
  arabic: "ARAB",
  russian: "RUSS",
  latin: "LAT",
  portuguese: "PORT",
  korean: "KOR",
};

function subjectForLanguage(languageFamily: string): string | null {
  return LANGUAGE_PREFIXES[languageFamily.toLowerCase()] ?? null;
}

export function evaluateForeignLanguage(
  ctx: EvaluatorContext,
  req: ForeignLanguageRequirement,
): RequirementResult {
  const placementLevel =
    ctx.student.admissions.foreignLanguageBackground?.placementLevel ?? 0;

  // Placement at or above minLevel satisfies the requirement outright.
  if (placementLevel >= req.minLevel) {
    return {
      status: "satisfied",
      requirementId: req.id,
      label: req.label,
      coursesMatched: [],
      creditsApplied: 0,
      message: `${req.label ?? req.id}: satisfied by placement (level ${placementLevel})`,
    };
  }

  // Otherwise find unclaimed courses at or above minLevel.
  // "any" means any recognized language subject — not literally any subject code.
  const knownLanguageSubjects = new Set(Object.values(LANGUAGE_PREFIXES));
  const subjectFilter =
    req.languageFamily !== "any" ? subjectForLanguage(req.languageFamily) : null;

  const eligible = ctx.courses.filter((c) => {
    if (!ctx.canClaim(c)) return false;
    const level = extractLevel(c.course);
    if (isNaN(level) || level < req.minLevel) return false;
    if (subjectFilter !== null) {
      // Specific language family required.
      if (!c.course.startsWith(`${subjectFilter} `)) return false;
    } else {
      // "any" language — must still be a recognized language subject.
      if (!knownLanguageSubjects.has(extractSubject(c.course))) return false;
    }
    return true;
  });

  let creditsApplied = 0;
  const claimed: string[] = [];

  for (const course of eligible) {
    if (creditsApplied >= req.credits) break;
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
      message: `${req.label ?? req.id}: satisfied by ${claimed.join(", ")}`,
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
      missing: `${req.credits - creditsApplied} more credits at level ≥ ${req.minLevel}`,
    };
  }

  return {
    status: "unsatisfied",
    requirementId: req.id,
    label: req.label,
    coursesMatched: [],
    creditsApplied: 0,
    message: `${req.label ?? req.id}: no language course at level ≥ ${req.minLevel} found`,
    missing: `${req.credits} credits of ${req.languageFamily} at level ≥ ${req.minLevel}`,
  };
}
