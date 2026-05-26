/**
 * VT Degree Program Schema
 * 
 * Defines the shape of a "program" (major/minor/concentration) at Virginia Tech.
 *
 * Design goals:
 *  - One DSL that expresses CS, History, Biology, and (by extension) every
 *    other undergraduate program at VT.
 *  - Validation at load time: malformed program JSON fails fast with helpful
 *    Zod errors before the audit engine ever sees it.
 *  - Composable: programs can `include` shared blocks (e.g., Pathways, the
 *    foreign-language requirement for BA degrees) instead of duplicating them.
 *  - Separates "what to take" (requirements) from "how to take it" (policies)
 *    and from "suggested order" (roadmap).
 *
 * Requirement types covered: 
 *   1.  exact              — single specific course
 *   2.  one_of             — equivalent alternatives for one slot
 *   3.  one_from_list      — pick one from an enumerated list
 *   4.  course_sequence    — paired "A and B" treated as one unit
 *   5.  credits_from_list  — N credits from an explicit list
 *   6.  credits_from_pool  — N credits from a rule-defined pool
 *   7.  choose_n_from_groups — distributional (e.g., 2 courses from each of 3 of 4 groups)
 *   8.  compound           — escape hatch: multiple constraints on one bucket (Biology electives)
 *   9.  foreign_language   — tiered language sequence
 *  10.  zero_credit        — required but not credit-bearing (e.g., ENGE 3900)
 *  11.  free_credits       — N credits of anything
 *  12.  aggregate_credits  — N credits across the degree matching a filter
 */

import { z } from "zod";

// Helpers

/** VT course code, normalized to "SUBJ NNNN[N][L]" with a single space */
export const CourseCodeSchema = z
  .string()
  .regex(/^[A-Z]{2,5}\s\d{4,5}[A-Z]?$/, {
    message: 'Course code must be like "CS 1114" or "MATH 2405H"',
  });

/** Letter grades */
export const GradeSchema = z.enum([
  "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "D+", "D", "D-",
  "F",
  "P", // pass for pass/fail courses
]);

/**
 * Pathways concept identifiers used by VT.
 * Regex rather than closed enum so future concepts (observed: 10, 11) don't
 * require a schema change — new IDs only need the regex updated.
 */
export const PathwaysConceptSchema = z
  .string()
  .regex(/^(1[AF]|[234]|5[AF]|6[AD]|7|1[01])$/, {
    message: "Pathways concept must be one of: 1A, 1F, 2, 3, 4, 5A, 5F, 6A, 6D, 7, 10, 11",
  });

// ---------------------------------------------------------------------------
// Pool definitions (used by credits_from_pool, etc.)
// ---------------------------------------------------------------------------

/**
 * A rule that defines a pool of eligible courses,
 * "any CS course at the 3000 level or above."
 */
export const PoolRuleSchema = z.object({
  subject: z.string().optional(),       // "CS"
  subjects: z.array(z.string()).optional(),
  minLevel: z.number().int().optional(), // 1000, 2000, 3000, 4000, 5000
  maxLevel: z.number().int().optional(),
});

/** Explicit list of eligible courses. */
export const ExplicitListPoolSchema = z.object({
  type: z.literal("explicit_list"),
  courses: z.array(CourseCodeSchema).min(1),
});

/**
 * Rule-based pool: eligibility defined by rules, with explicit additions
 * and exclusions. Models VT's "any CS 3000+ except {blacklist}" pattern found on checksheet
 */
export const RuleBasedPoolSchema = z.object({
  type: z.literal("rule_based"),
  rules: z.array(PoolRuleSchema).min(1),
  additionalAllowed: z.array(CourseCodeSchema).default([]),
  excluded: z.array(CourseCodeSchema).default([]),
});

/** Pool defined by Pathways designation (any course designated 6A). */
export const PathwaysDesignatedPoolSchema = z.object({
  type: z.literal("pathways_designated"),
  concept: PathwaysConceptSchema,
});

/**
 * Exclusion-based pool: defined by what is NOT allowed. Used for
 * Biology's "30 credits of non-technical" requirement, where the pool is
 * effectively "everything except {excluded subjects}".
 */
export const ExclusionBasedPoolSchema = z.object({
  type: z.literal("exclusion_based"),
  excludedSubjects: z.array(z.string()).default([]),
  excludedCourses: z.array(CourseCodeSchema).default([]),
  note: z.string().optional(),
});

export const PoolSchema = z.discriminatedUnion("type", [
  ExplicitListPoolSchema,
  RuleBasedPoolSchema,
  PathwaysDesignatedPoolSchema,
  ExclusionBasedPoolSchema,
]);


// Requirement types

/** Fields every requirement shares */
const BaseRequirementFields = {
  id: z.string().min(1),
  label: z.string().optional(),
  note: z.string().optional(),
};

/** Pattern 1: a single specific course is required */
export const ExactCourseSchema = z.object({
  type: z.literal("exact"),
  ...BaseRequirementFields,
  course: CourseCodeSchema,
  credits: z.number().positive().optional(),
  minGrade: GradeSchema.optional(),
  substitutes: z.array(CourseCodeSchema).default([]),
  noDoubleCounting: z.boolean().default(false),
});

/**
 * Pattern 2: one slot, multiple equivalent ways to satisfy.
 * Each option is either a single course or a paired sequence.
 *
 * Example: MATH 2204 or CMDA 2005
 * Example: (ENGE 1215 + ENGE 1216) or ENGE 1414
 */
export const OneOfOptionSchema = z.union([
  z.object({ course: CourseCodeSchema }),
  z.object({ sequence: z.array(CourseCodeSchema).min(2) }),
]);

export const OneOfSchema = z.object({
  type: z.literal("one_of"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
  options: z.array(OneOfOptionSchema).min(2),
  minGrade: GradeSchema.optional(),
});

/**
 * Pattern 3: pick exactly one course from an enumerated list.
 * Example: CS Theory Elective — pick one of {CS 4104, CS 4114, CS 4124, ...}
 */
export const OneFromListSchema = z.object({
  type: z.literal("one_from_list"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
  courses: z.array(CourseCodeSchema).min(2),
});

/**
 * Pattern 4: paired courses that count as one unit.
 * Example: HIST 1025 and HIST 1026 as the "European history" survey.
 * Always required a pair.
 */
export const CourseSequenceSchema = z.object({
  type: z.literal("course_sequence"),
  ...BaseRequirementFields,
  courses: z.array(CourseCodeSchema).min(2),
  credits: z.number().positive(),
});

/**
 * Pattern 5: N credits from an explicit list of courses.
 * Example: 22 credits of Biological Sciences electives from {long enumerated list}.
 */
export const CreditsFromListSchema = z.object({
  type: z.literal("credits_from_list"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
  courses: z.array(CourseCodeSchema).min(1),
  /** Optional minimum number of distinct courses (not just credit total). */
  minCourses: z.number().int().positive().optional(),
});

/**
 * Pattern 6: N credits drawn from a rule-defined pool.
 * Example: 6 credits of CS 3/4/5XXX electives = any CS 3000+ except these
 */
export const CreditsFromPoolSchema = z.object({
  type: z.literal("credits_from_pool"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
  pool: PoolSchema,
  minCourses: z.number().int().positive().optional(),
});

/**
 * Pattern 7: distributional requirement — pick N courses from each of M groups,
 * where the student chooses which M groups to use.
 * Example: History — 2 courses from each of 3 of 4 thematic groups.
 */
export const RequirementGroupOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  courses: z.array(CourseCodeSchema).min(1),
});

export const ChooseNFromGroupsSchema = z.object({
  type: z.literal("choose_n_from_groups"),
  ...BaseRequirementFields,
  groupsToChoose: z.number().int().positive(),
  coursesPerGroup: z.number().int().positive(),
  credits: z.number().positive(),
  groups: z.array(RequirementGroupOptionSchema).min(2),
});

/**
 * Pattern 9: tiered foreign language requirement.
 * The student must complete the language sequence through a minimum level,
 * with lower-level courses potentially waived based on prior background.
 */
export const ForeignLanguageSchema = z.object({
  type: z.literal("foreign_language"),
  ...BaseRequirementFields,
  /** Minimum course number the student must complete (e.g., 2106). */
  minLevel: z.number().int(),
  /** "any" or a specific language. */
  languageFamily: z.string().default("any"),
  credits: z.number().nonnegative(),
});

/**
 * Pattern 10: required but not credit-bearing.
 * Example: ENGE 3900 Career Bridge Experience — 0 credits, must be on transcript.
 */
export const ZeroCreditSchema = z.object({
  type: z.literal("zero_credit"),
  ...BaseRequirementFields,
  course: CourseCodeSchema,
});

/**
 * Pattern 11: N credits of anything (subject to general degree rules).
 * Example: "remaining hours to reach 120 total."
 */
export const FreeCreditsSchema = z.object({
  type: z.literal("free_credits"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
});

/**
 * Pattern 12: aggregate constraint across the whole degree.
 * Example: CS BS requires 30 credits of non-technical courses spread anywhere.
 * Different from credits_from_pool because it sums across other requirements'
 * fulfillment, not its own dedicated bucket.
 */
export const AggregateCreditsSchema = z.object({
  type: z.literal("aggregate_credits"),
  ...BaseRequirementFields,
  credits: z.number().positive(),
  pool: PoolSchema,
});

/**
 * Pattern 8: ESCAPE HATCH — compound requirement.
 *
 * A bucket with a credit target AND multiple internal constraints that must
 * all be satisfied simultaneously. Models Biology's 22-credit elective bucket
 * with sub-constraints (one organism course + three labs + 12 credits at
 * 3000+ + cap on non-BIOL credits).
 *
 * Courses in this bucket may satisfy multiple sub-requirements at once.
 */

// Forward declaration via z.lazy because Compound contains Requirement.
export type RequirementType =
  | z.infer<typeof ExactCourseSchema>
  | z.infer<typeof OneOfSchema>
  | z.infer<typeof OneFromListSchema>
  | z.infer<typeof CourseSequenceSchema>
  | z.infer<typeof CreditsFromListSchema>
  | z.infer<typeof CreditsFromPoolSchema>
  | z.infer<typeof ChooseNFromGroupsSchema>
  | z.infer<typeof ForeignLanguageSchema>
  | z.infer<typeof ZeroCreditSchema>
  | z.infer<typeof FreeCreditsSchema>
  | z.infer<typeof AggregateCreditsSchema>
  | CompoundRequirement;

export type CompoundRequirement = {
  type: "compound";
  id: string;
  label?: string;
  note?: string;
  credits: number;
  subRequirements: RequirementType[];
  caps?: Array<{
    label: string;
    appliesTo:
      | { courses: string[] }
      | { subjects: string[] }
      | { predicate: string };
    maxCredits: number;
  }>;
};

export const CompoundSchema: z.ZodType<CompoundRequirement> = z.lazy(() =>
  z.object({
    type: z.literal("compound"),
    id: z.string().min(1),
    label: z.string().optional(),
    note: z.string().optional(),
    credits: z.number().positive(),
    subRequirements: z.array(RequirementSchema).min(1),
    caps: z
      .array(
        z.object({
          label: z.string(),
          appliesTo: z.union([
            z.object({ courses: z.array(CourseCodeSchema) }),
            z.object({ subjects: z.array(z.string()) }),
            z.object({ predicate: z.string() }),
          ]),
          maxCredits: z.number().positive(),
        }),
      )
      .optional(),
  }),
);

/**
 * The full union of all requirement types.
 */
export const RequirementSchema: z.ZodType<RequirementType> = z.lazy(() =>
  z.union([
    ExactCourseSchema,
    OneOfSchema,
    OneFromListSchema,
    CourseSequenceSchema,
    CreditsFromListSchema,
    CreditsFromPoolSchema,
    ChooseNFromGroupsSchema,
    ForeignLanguageSchema,
    ZeroCreditSchema,
    FreeCreditsSchema,
    AggregateCreditsSchema,
    CompoundSchema,
  ]),
);

// Requirement groups 

export const RequirementGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  credits: z.number().nonnegative().optional(),
  requirements: z.array(RequirementSchema).min(1),
});

/**
 * Controls whether a course can simultaneously satisfy requirements in two
 * different groups. The default is conservative: no double-counting unless
 * explicitly allowed.
 */
export const DoubleCountRuleSchema = z.object({
  type: z.enum(["allow", "forbid"]),
  between: z.tuple([z.string(), z.string()]),
  except: z.array(z.string()).default([]),
  note: z.string().optional(),
});

// Program-level policies (non-requirement metadata)

export const ProgramPoliciesSchema = z.object({
  /** Default cap on attempts per major course  */
  defaultMaxAttempts: z.number().int().positive().optional(),
  /** Per-course overrides on attempt limits. */
  perCourseAttemptLimits: z.record(z.string(), z.number().int().positive()).optional(),
  /** Cap on total number of major courses a student may repeat. */
  maxRepeatedCourses: z.number().int().positive().optional(),
  /** Courses required for degree but excluded from in-major GPA. */
  inMajorGPAExclusions: z.array(CourseCodeSchema).default([]),
  /** Minimum grade required in specific courses */
  minGradeRequiredCourses: z
    .array(z.object({ course: CourseCodeSchema, grade: GradeSchema }))
    .default([]),
});

// Top-level program

export const ProgramSchema = z.object({
  programId: z.string().min(1),         // "CS_BS"
  programName: z.string().min(1),       // "B.S. Computer Science"
  degreeType: z.enum(["BS", "BA", "BFA", "BSBA", "BArch", "BSN", "BLA"]),
  college: z.string().min(1),
  /** Catalog year this definition applies "2024-2025". */
  catalogYear: z.string().regex(/^\d{4}-\d{4}$/, "Format: 'YYYY-YYYY'"),
  totalCredits: z.number().int().positive(),
  gpaRequirements: z.object({
    overall: z.number().min(0).max(4),
    inMajor: z.number().min(0).max(4).optional(),
    inMajorSubject: z.string().optional(),
  }),
  /** IDs of shared blocks to merge in ("pathways-2024"). */
  includes: z.array(z.string()).default([]),
  doubleCountRules: z.array(DoubleCountRuleSchema).default([]),
  requirementGroups: z.array(RequirementGroupSchema).min(1),
  policies: ProgramPoliciesSchema.default({
    inMajorGPAExclusions: [],
    minGradeRequiredCourses: [],
  }),
  /** ID of the default suggested roadmap, if any */
  defaultRoadmap: z.string().optional(),
});

export type Program = z.infer<typeof ProgramSchema>;
export type RequirementGroup = z.infer<typeof RequirementGroupSchema>;
export type DoubleCountRule = z.infer<typeof DoubleCountRuleSchema>;
export type ProgramPolicies = z.infer<typeof ProgramPoliciesSchema>;
export type Pool = z.infer<typeof PoolSchema>;


// When parsed object fails throw error

export function parseProgram(input: unknown): Program {
  const result = ProgramSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Program validation failed:\n${issues}`);
  }
  return result.data;
}