/**
 * Audit Engine — Result Types
 *
 * This is the contract between the dispatcher, every evaluator, and any
 * consumer (CLI, UI, API)
 */

import type { Program, DoubleCountRule } from "../schemas/program.ts";
import type { StudentRecord, AdvisorApproval, Grade } from "../schemas/student.ts";

export type { Program, StudentRecord, AdvisorApproval, DoubleCountRule };

// AuditCourse — mutable wrapper around an effective course

/**
 * A course from effectiveCourses() augmented with consumption state
 */
export type AuditCourse = {
  course: string;
  credits: number;
  source: "completed" | "in_progress" | "transfer";
  consumed: boolean;
  consumedBy?: string; // "groupId:requirementId"
};

// EvaluatorContext — everything an evaluator needs, passed as one object

export type EvaluatorContext = {
  program: Program;
  student: StudentRecord;
  /** Shared mutable pool — evaluators mutate consumed/consumedBy on entries they claim. */
  courses: AuditCourse[];
  approvals: AdvisorApproval[];
  /** The requirement group currently being processed (used by canClaim). */
  currentGroupId: string;
  /**
   * Returns true if this evaluator is allowed to claim the course.
   * Handles double-count rules automatically. Evaluators MUST call this
   * before marking a course consumed.
   */
  canClaim: (course: AuditCourse) => boolean;
};

// RequirementResult — tagged union returned by every evaluator

export type SatisfiedResult = {
  status: "satisfied";
  requirementId: string;
  label?: string;
  coursesMatched: string[];
  creditsApplied: number;
  message: string;
};

export type UnsatisfiedResult = {
  status: "unsatisfied";
  requirementId: string;
  label?: string;
  coursesMatched: string[];
  creditsApplied: number;
  message: string;
  missing: string;
};

export type PartialResult = {
  status: "partial";
  requirementId: string;
  label?: string;
  coursesMatched: string[];
  creditsApplied: number;
  creditsNeeded: number;
  message: string;
  missing: string;
};

export type RequirementResult = SatisfiedResult | UnsatisfiedResult | PartialResult;

// GroupResult — rolled-up summary for one RequirementGroup

export type GroupResult = {
  groupId: string;
  label: string;
  creditTarget?: number;
  creditsApplied: number;
  satisfied: boolean;
  requirementResults: RequirementResult[];
};


// GpaCheck — one GPA threshold that must be met

export type GpaCheck = {
  label: string;
  required: number;
  actual: number;
  passed: boolean;
};

// AuditResult — the full output of runAudit()

export type AuditResult = {
  studentId: string;
  programId: string;
  timestamp: string; // ISO 8601
  groupResults: GroupResult[];
  gpaChecks: GpaCheck[];
  eligible: boolean;
  summary: {
    totalCreditsApplied: number;
    totalCreditsRequired: number;
    groupsSatisfied: number;
    groupsTotal: number;
    requirementsSatisfied: number;
    requirementsTotal: number;
  };
};

/**
 * Returns the grade for a completed course on the student's transcript.
 * Returns null for transfer credits and in-progress courses.
 * If the student took the same course multiple times, returns the most
 * recent passing grade.
 */
export function lookupGrade(student: StudentRecord, courseCode: string): Grade | null {
  let found: Grade | null = null;
  for (const entry of student.courseRecord) {
    if (entry.status === "completed" && entry.course === courseCode) {
      found = entry.grade;
    }
  }
  return found;
}
