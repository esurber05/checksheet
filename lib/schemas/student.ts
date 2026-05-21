/**
 * Student Record Schema
 * 
 * Defines the shape of a student record — the per-user data that the audit
 * engine evaluates against a Program definition.
 */

import { z } from "zod";
import { CourseCodeSchema, GradeSchema } from "./program.ts";

// Helpers 

/** Semester identifier, e.g. "fall_2024", "spring_2025", "summer_2025" */
export const SemesterSchema = z
  .string()
  .regex(/^(fall|spring|summer|winter)_\d{4}$/, {
    message: 'Semester must be like "fall_2024"',
  });

/** Catalog year, e.g. "2024-2025" */
export const CatalogYearSchema = z
  .string()
  .regex(/^\d{4}-\d{4}$/, "Format: 'YYYY-YYYY'");


// Course entries

/** A course the student has finished and received a grade for */
export const CompletedCourseSchema = z.object({
  status: z.literal("completed"),
  course: CourseCodeSchema,
  credits: z.number().positive(),
  grade: GradeSchema,
  semester: SemesterSchema,
  /** True if this satisfied a "Pass/Fail" registration (NOT PUT IN GPA) */
  passFail: z.boolean().default(false),
});

/**
 * A course the student is currently taking. Counted toward audit as
 * "in progress" but not yet in GPA
 */
export const InProgressCourseSchema = z.object({
  status: z.literal("in_progress"),
  course: CourseCodeSchema,
  credits: z.number().positive(),
  semester: SemesterSchema,
});

/**
 * A course the student has placed in the planner for a future semester.
 * Used by the planner to project graduation, but not counted as effective
 * by the audit engine.
 */
export const PlannedCourseSchema = z.object({
  status: z.literal("planned"),
  course: CourseCodeSchema,
  credits: z.number().positive(),
  semester: SemesterSchema,
});

/**
 * Credit earned outside VT
 * `course` is the original course code (or exam name), 
 * `vtEquivalent` is the VT course it satisfies,
 * No grade - does not effect GPA
 */
export const TransferCourseSchema = z.object({
  status: z.literal("transfer"),
  course: z.string().min(1), // no contraist because outside VT
  credits: z.number().positive(),
  vtEquivalent: CourseCodeSchema,
  source: z.enum(["transfer", "ap", "ib", "dual_enrollment", "clep", "credit_by_exam"]),
  semester: SemesterSchema.optional(),
});

/**
 * A withdrawn attempt. Doesn't count toward graduation but DOES count
 * toward the per-course attempt limit
 */
export const WithdrawnCourseSchema = z.object({
  status: z.literal("withdrawn"),
  course: CourseCodeSchema,
  semester: SemesterSchema,
  withdrawalDate: z.string().optional(),
});

export const CourseEntrySchema = z.discriminatedUnion("status", [
  CompletedCourseSchema,
  InProgressCourseSchema,
  PlannedCourseSchema,
  TransferCourseSchema,
  WithdrawnCourseSchema,
]);

// Advisor approvals — substitutions, waivers, elective approvals
// Allows for flexability 

export const AdvisorApprovalSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["substitution", "waiver", "elective_approval"]),
  /** The requirement ID this approval applies to (matches Program requirement id). */
  forRequirement: z.string().optional(),
  /** Course being substituted-for */
  substitutesCourse: CourseCodeSchema.optional(),
  /** Course being used in its place */
  withCourse: CourseCodeSchema.optional(),
  approvedBy: z.string().min(1),
  approvedDate: z.string(),
  notes: z.string().optional(),
});

// Admissions context — foreign language, AP credits, transfer history

export const ForeignLanguageBackgroundSchema = z.object({
  language: z.string().min(1),
  yearsHighSchool: z.number().int().nonnegative().optional(),
  collegeCredits: z.number().nonnegative().optional(),
  /** Placement test level achieved, e.g. 2106. */
  placementLevel: z.number().int().optional(),
});

export const AdmissionsSchema = z.object({
  foreignLanguageBackground: ForeignLanguageBackgroundSchema.optional(),
});

// Program enrollment

export const ProgramEnrollmentSchema = z.object({
  programId: z.string().min(1),
  type: z.enum(["major", "minor", "concentration"]),
  declaredDate: z.string().optional(),
});

// Top-level student record

export const StudentRecordSchema = z.object({
  studentId: z.string().min(1),
  displayName: z.string().min(1),
  catalogYear: CatalogYearSchema, /** Year for schema */
  enrolledSemester: SemesterSchema,
  expectedGraduation: SemesterSchema.optional(),

  programs: z.array(ProgramEnrollmentSchema).min(1),

  admissions: AdmissionsSchema.default({}),

  courseRecord: z.array(CourseEntrySchema).default([]),

  advisorApprovals: z.array(AdvisorApprovalSchema).default([]),
});

export type StudentRecord = z.infer<typeof StudentRecordSchema>;
export type CourseEntry = z.infer<typeof CourseEntrySchema>;
export type CompletedCourse = z.infer<typeof CompletedCourseSchema>;
export type AdvisorApproval = z.infer<typeof AdvisorApprovalSchema>;
export type ProgramEnrollment = z.infer<typeof ProgramEnrollmentSchema>;
export type Grade = z.infer<typeof GradeSchema>;

// Parser with helpful error messages

export function parseStudentRecord(input: unknown): StudentRecord {
  const result = StudentRecordSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Student record validation failed:\n${issues}`);
  }
  return result.data;
}

// Computed helpers
// API - for planner, scheduler, auditer

/** All courses the student has finished, regardless of outcome */
export function completedCourses(r: StudentRecord): CompletedCourse[] {
  return r.courseRecord.filter(
    (c): c is CompletedCourse => c.status === "completed",
  );
}

/**
 * Courses that count toward audit: completed (with passing grade),
 * in-progress, and transfer credits. Excludes planned and withdrawn.
 */
export type EffectiveCourse = {
  course: string;
  credits: number;
  source: "completed" | "in_progress" | "transfer";
};

export function effectiveCourses(r: StudentRecord): EffectiveCourse[] {
  const out: EffectiveCourse[] = [];
  for (const c of r.courseRecord) {
    if (c.status === "completed" && !isFailingGrade(c.grade)) {
      out.push({ course: c.course, credits: c.credits, source: "completed" });
    } else if (c.status === "in_progress") {
      out.push({ course: c.course, credits: c.credits, source: "in_progress" });
    } else if (c.status === "transfer") {
      out.push({ course: c.vtEquivalent, credits: c.credits, source: "transfer" });
    }
  }
  return out;
}

/**
 * Number of times a student has attempted a course, counting withdrawals
 * and failed attempts. Used to enforce VT's attempt-limit policy.
 */
export function attemptCount(r: StudentRecord, courseCode: string): number {
  return r.courseRecord.filter((c) => {
    if (c.status === "completed") return c.course === courseCode;
    if (c.status === "in_progress") return c.course === courseCode;
    if (c.status === "withdrawn") return c.course === courseCode;
    return false;
  }).length;
}

/**
 * Total credits applied toward graduation: completed + in-progress
 * + transfer. Does not include planned or withdrawn
 */
export function totalEffectiveCredits(r: StudentRecord): number {
  return effectiveCourses(r).reduce((sum, c) => sum + c.credits, 0);
}

/** quality points per credit hour - VT scale */
export function gradePoints(grade: Grade): number | null {
  // Pass and non-graded entries don't enter GPA
  if (grade === "P") return null;
  const table: Record<Grade, number> = {
    "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0,
    "P": 0.0,
  };
  return table[grade];
}

export function isFailingGrade(grade: Grade): boolean {
  return grade === "F";
}

/**
 * Overall GPA across all completed graded courses.
 */
export function overallGPA(r: StudentRecord): number {
  let qualityPoints = 0;
  let attemptedCredits = 0;
  for (const c of completedCourses(r)) {
    if (c.passFail) continue;
    const gp = gradePoints(c.grade);
    if (gp === null) continue;
    qualityPoints += gp * c.credits;
    attemptedCredits += c.credits;
  }
  if (attemptedCredits === 0) return 0;
  return qualityPoints / attemptedCredits;
}

/**
 * In-major GPA, computed over courses in the given subject (e.g., "CS").
 * Used by VT's in-major GPA requirement
 *
 */
export function inMajorGPA(
  r: StudentRecord,
  subject: string,
  exclusions: string[] = [],
): number {
  const excluded = new Set(exclusions);
  let qualityPoints = 0;
  let attemptedCredits = 0;
  for (const c of completedCourses(r)) {
    if (c.passFail) continue;
    if (excluded.has(c.course)) continue;
    if (!c.course.startsWith(`${subject} `)) continue;
    const gp = gradePoints(c.grade);
    if (gp === null) continue;
    qualityPoints += gp * c.credits;
    attemptedCredits += c.credits;
  }
  if (attemptedCredits === 0) return 0;
  return qualityPoints / attemptedCredits;
}

/**
 * Does the student's completed grade meet the minimum required grade for
 * a course?
 */
export function meetsMinGrade(actual: Grade, required: Grade): boolean {
  const a = gradePoints(actual);
  const r = gradePoints(required);
  if (a === null || r === null) return actual === required;
  return a >= r;
}