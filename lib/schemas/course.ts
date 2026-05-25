/**
 * Course
 * 
 * Defines the shape of a course for VT
 */

import { z } from "zod";
import { CourseCodeSchema, PathwaysConceptSchema } from "./program.ts";

export const CreditRangeSchema = z.object({
  min: z.number().int().nonnegative(),
  max: z.number().int().nonnegative(),
});

const CourseRefsSchema = z.object({
  rawText: z.string().optional(),
  referencedCourses: z.array(CourseCodeSchema),
});

export const CourseSchema = z.object({
  /** Normalized course code, e.g. "CS 3214" */
  code: CourseCodeSchema,
  /** Subject prefix, e.g. "CS" — derived from code */
  subject: z.string().min(1),
  /** Course number including any trailing letter, e.g. "3214" or "2984E" */
  number: z.string().min(1),
  /** Thousands-level derived from the first digit of number, e.g. 3000 */
  level: z.number().int().nonnegative(),
  title: z.string().min(1),
  credits: CreditRangeSchema,
  isVariableCredit: z.boolean(),
  description: z.string().optional(),
  prerequisites: CourseRefsSchema.optional(),
  corequisites: CourseRefsSchema.optional(),
  /** Array of Pathways concept IDs, e.g. ["5F", "10"] */
  pathwaysConcepts: z.array(PathwaysConceptSchema),
  contactHours: z.string().optional(),
  crossListedWith: z.array(CourseCodeSchema),
  repeatability: z.string().optional(),
  sourceUrl: z.string().url(),
  catalogYear: z.string().regex(/^\d{4}-\d{4}$/, "Format: 'YYYY-YYYY'"),
});

export type Course = z.infer<typeof CourseSchema>;
export type CreditRange = z.infer<typeof CreditRangeSchema>;

export function parseCourse(input: unknown): Course {
  const result = CourseSchema.safeParse(input);
  if (!result.success) {
    const code =
      typeof input === "object" && input !== null && "code" in input
        ? String((input as { code: unknown }).code)
        : "unknown";
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Course validation failed for ${code}:\n${issues}`);
  }
  return result.data;
}
