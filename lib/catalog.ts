import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { Course } from "./schemas/course.ts";

interface SubjectFile {
  subject: string;
  scrapedAt: string;
  catalogYear: string;
  courses: Course[];
}

let byCode: Map<string, Course> | null = null;
let byConcept: Map<string, Course[]> | null = null;
let bySubject: Map<string, Course[]> | null = null;
let aliases: Map<string, string> | null = null;

/**
 * Ensure file
 */
function ensure(): void {
  if (byCode !== null) return;
  byCode = new Map();
  byConcept = new Map();
  bySubject = new Map();
  aliases = new Map();

  const dir = path.join(process.cwd(), "data", "catalog", "by-subject");
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return;
  }

  for (const file of files) {
    const { courses }: SubjectFile = JSON.parse(
      readFileSync(path.join(dir, file), "utf-8")
    );
    for (const course of courses) {
      byCode.set(course.code, course);

      const sub = bySubject.get(course.subject) ?? [];
      if (!bySubject.has(course.subject)) bySubject.set(course.subject, sub);
      sub.push(course);

      for (const concept of course.pathwaysConcepts) {
        const cl = byConcept.get(concept) ?? [];
        if (!byConcept.has(concept)) byConcept.set(concept, cl);
        cl.push(course);
      }

      for (const alias of course.crossListedWith) {
        if (!aliases.has(alias)) aliases.set(alias, course.code);
      }
    }
  }
}

/**
 * Loads catalog of courses into memory
 */
export function loadCatalog(): void {
  ensure();
}

/**
 * Looks up course with code
 * @param code course code "CS 3214"
 * @returns Course value
 */
export function lookupCourse(code: string): Course | undefined {
  ensure();
  return byCode!.get(code);
}

/**
 * Looks up a pathways concept and returns all courses that match
 * @param concept pathways concept
 * @returns Course array of all courses matching pathways concept
 */
export function coursesByPathwaysConcept(concept: string): Course[] {
  ensure();
  return byConcept!.get(concept) ?? [];
}

/**
 * Look up all courses by subject number
 * @param subject VT subjet e.g. ("cs")
 * @returns Array of all courses in catalog that match CS
 */
export function coursesBySubject(subject: string): Course[] {
  ensure();
  return bySubject!.get(subject.toUpperCase()) ?? [];
}

/**
 * If a course alias to another it will return the string
 * @param code course code
 * @returns string of course it matches to
 */
export function resolveAlias(code: string): string {
  ensure();
  return aliases!.get(code) ?? code;
}
