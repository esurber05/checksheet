/**
 * Pool matching helpers — pure functions shared by credits-from-pool and
 * aggregate-credits. No side effects, no mutable state.
 */

import type { Pool } from "../../schemas/program.ts";

export function extractSubject(courseCode: string): string {
  return courseCode.split(" ")[0];
}

export function extractLevel(courseCode: string): number {
  return parseInt(courseCode.split(" ")[1], 10);
}

/**
 * Returns true if courseCode belongs to the given pool.
 *
 * pathwaysMap: optional external lookup of course → pathways concepts.
 * For v1, pass an empty Map (or omit). Pathways pools will report 0 credits
 * until a course catalog integration populates this map.
 *
 * To populate: build a Map<string, string[]> where keys are VT course codes
 * and values are arrays of Pathways concept strings (e.g. ["6D", "1A"]).
 * That data must come from the VT course catalog, which is not in scope yet.
 */
export function courseMatchesPool(
  courseCode: string,
  pool: Pool,
  pathwaysMap: Map<string, string[]> = new Map(),
): boolean {
  switch (pool.type) {
    case "explicit_list":
      return pool.courses.includes(courseCode);

    case "rule_based": {
      if (pool.excluded.includes(courseCode)) return false;
      if (pool.additionalAllowed.includes(courseCode)) return true;
      const subject = extractSubject(courseCode);
      const level = extractLevel(courseCode);
      for (const rule of pool.rules) {
        let matches = true;
        if (rule.subject !== undefined && rule.subject !== subject) matches = false;
        if (rule.subjects !== undefined && !rule.subjects.includes(subject)) matches = false;
        if (rule.minLevel !== undefined && level < rule.minLevel) matches = false;
        if (rule.maxLevel !== undefined && level > rule.maxLevel) matches = false;
        if (matches) return true;
      }
      return false;
    }

    case "pathways_designated": {
      const concepts = pathwaysMap.get(courseCode);
      return concepts?.includes(pool.concept) ?? false;
    }

    case "exclusion_based": {
      const subject = extractSubject(courseCode);
      if (pool.excludedSubjects.includes(subject)) return false;
      if (pool.excludedCourses.includes(courseCode)) return false;
      return true;
    }
  }
}
