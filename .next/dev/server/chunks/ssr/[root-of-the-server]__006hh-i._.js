module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/schemas/program.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AggregateCreditsSchema",
    ()=>AggregateCreditsSchema,
    "ChooseNFromGroupsSchema",
    ()=>ChooseNFromGroupsSchema,
    "CompoundSchema",
    ()=>CompoundSchema,
    "CourseCodeSchema",
    ()=>CourseCodeSchema,
    "CourseSequenceSchema",
    ()=>CourseSequenceSchema,
    "CreditsFromListSchema",
    ()=>CreditsFromListSchema,
    "CreditsFromPoolSchema",
    ()=>CreditsFromPoolSchema,
    "DoubleCountRuleSchema",
    ()=>DoubleCountRuleSchema,
    "ExactCourseSchema",
    ()=>ExactCourseSchema,
    "ExclusionBasedPoolSchema",
    ()=>ExclusionBasedPoolSchema,
    "ExplicitListPoolSchema",
    ()=>ExplicitListPoolSchema,
    "ForeignLanguageSchema",
    ()=>ForeignLanguageSchema,
    "FreeCreditsSchema",
    ()=>FreeCreditsSchema,
    "GradeSchema",
    ()=>GradeSchema,
    "OneFromListSchema",
    ()=>OneFromListSchema,
    "OneOfOptionSchema",
    ()=>OneOfOptionSchema,
    "OneOfSchema",
    ()=>OneOfSchema,
    "PathwaysConceptSchema",
    ()=>PathwaysConceptSchema,
    "PathwaysDesignatedPoolSchema",
    ()=>PathwaysDesignatedPoolSchema,
    "PoolRuleSchema",
    ()=>PoolRuleSchema,
    "PoolSchema",
    ()=>PoolSchema,
    "ProgramPoliciesSchema",
    ()=>ProgramPoliciesSchema,
    "ProgramSchema",
    ()=>ProgramSchema,
    "RequirementGroupOptionSchema",
    ()=>RequirementGroupOptionSchema,
    "RequirementGroupSchema",
    ()=>RequirementGroupSchema,
    "RequirementSchema",
    ()=>RequirementSchema,
    "RuleBasedPoolSchema",
    ()=>RuleBasedPoolSchema,
    "ZeroCreditSchema",
    ()=>ZeroCreditSchema,
    "parseProgram",
    ()=>parseProgram
]);
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const CourseCodeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[A-Z]{2,5}\s\d{4}[A-Z]?$/, {
    message: 'Course code must be like "CS 1114" or "MATH 2405H"'
});
const GradeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
    "P"
]);
const PathwaysConceptSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "1F",
    "1A",
    "2",
    "3",
    "4",
    "5F",
    "5A",
    "6D",
    "6A",
    "7"
]);
const PoolRuleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    subjects: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    minLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional(),
    maxLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional()
});
const ExplicitListPoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("explicit_list"),
    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(1)
});
const RuleBasedPoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("rule_based"),
    rules: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(PoolRuleSchema).min(1),
    additionalAllowed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).default([]),
    excluded: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).default([])
});
const PathwaysDesignatedPoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("pathways_designated"),
    concept: PathwaysConceptSchema
});
const ExclusionBasedPoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("exclusion_based"),
    excludedSubjects: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    excludedCourses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).default([]),
    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const PoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].discriminatedUnion("type", [
    ExplicitListPoolSchema,
    RuleBasedPoolSchema,
    PathwaysDesignatedPoolSchema,
    ExclusionBasedPoolSchema
]);
// Requirement types
/** Fields every requirement shares */ const BaseRequirementFields = {
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
};
const ExactCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("exact"),
    ...BaseRequirementFields,
    course: CourseCodeSchema,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    minGrade: GradeSchema.optional(),
    substitutes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).default([]),
    noDoubleCounting: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false)
});
const OneOfOptionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        course: CourseCodeSchema
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        sequence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(2)
    })
]);
const OneOfSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("one_of"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    options: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(OneOfOptionSchema).min(2),
    minGrade: GradeSchema.optional()
});
const OneFromListSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("one_from_list"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(2)
});
const CourseSequenceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("course_sequence"),
    ...BaseRequirementFields,
    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(2),
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive()
});
const CreditsFromListSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("credits_from_list"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(1),
    /** Optional minimum number of distinct courses (not just credit total). */ minCourses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional()
});
const CreditsFromPoolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("credits_from_pool"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    pool: PoolSchema,
    minCourses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional()
});
const RequirementGroupOptionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).min(1)
});
const ChooseNFromGroupsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("choose_n_from_groups"),
    ...BaseRequirementFields,
    groupsToChoose: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive(),
    coursesPerGroup: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive(),
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    groups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(RequirementGroupOptionSchema).min(2)
});
const ForeignLanguageSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("foreign_language"),
    ...BaseRequirementFields,
    /** Minimum course number the student must complete (e.g., 2106). */ minLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int(),
    /** "any" or a specific language. */ languageFamily: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default("any"),
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative()
});
const ZeroCreditSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("zero_credit"),
    ...BaseRequirementFields,
    course: CourseCodeSchema
});
const FreeCreditsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("free_credits"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive()
});
const AggregateCreditsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("aggregate_credits"),
    ...BaseRequirementFields,
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    pool: PoolSchema
});
const CompoundSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].lazy(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("compound"),
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
        subRequirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(RequirementSchema).min(1),
        caps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            appliesTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                    courses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema)
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                    subjects: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string())
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                    predicate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
                })
            ]),
            maxCredits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive()
        })).optional()
    }));
const RequirementSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].lazy(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
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
        CompoundSchema
    ]));
const RequirementGroupSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative().optional(),
    requirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(RequirementSchema).min(1)
});
const DoubleCountRuleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "allow",
        "forbid"
    ]),
    between: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].tuple([
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
    ]),
    except: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const ProgramPoliciesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    /** Default cap on attempts per major course  */ defaultMaxAttempts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional(),
    /** Per-course overrides on attempt limits. */ perCourseAttemptLimits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive()).optional(),
    /** Cap on total number of major courses a student may repeat. */ maxRepeatedCourses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive().optional(),
    /** Courses required for degree but excluded from in-major GPA. */ inMajorGPAExclusions: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseCodeSchema).default([]),
    /** Minimum grade required in specific courses */ minGradeRequiredCourses: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        course: CourseCodeSchema,
        grade: GradeSchema
    })).default([])
});
const ProgramSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    programId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    programName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    degreeType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "BS",
        "BA",
        "BFA",
        "BSBA",
        "BArch",
        "BSN",
        "BLA"
    ]),
    college: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    /** Catalog year this definition applies "2024-2025". */ catalogYear: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{4}$/, "Format: 'YYYY-YYYY'"),
    totalCredits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().positive(),
    gpaRequirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        overall: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(4),
        inMajor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(4).optional(),
        inMajorSubject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }),
    /** IDs of shared blocks to merge in ("pathways-2024"). */ includes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([]),
    doubleCountRules: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(DoubleCountRuleSchema).default([]),
    requirementGroups: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(RequirementGroupSchema).min(1),
    policies: ProgramPoliciesSchema.default({
        inMajorGPAExclusions: [],
        minGradeRequiredCourses: []
    }),
    /** ID of the default suggested roadmap, if any */ defaultRoadmap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
function parseProgram(input) {
    const result = ProgramSchema.safeParse(input);
    if (!result.success) {
        const issues = result.error.issues.map((i)=>`  • ${i.path.join(".")}: ${i.message}`).join("\n");
        throw new Error(`Program validation failed:\n${issues}`);
    }
    return result.data;
}
}),
"[project]/lib/schemas/student.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdmissionsSchema",
    ()=>AdmissionsSchema,
    "AdvisorApprovalSchema",
    ()=>AdvisorApprovalSchema,
    "CatalogYearSchema",
    ()=>CatalogYearSchema,
    "CompletedCourseSchema",
    ()=>CompletedCourseSchema,
    "CourseEntrySchema",
    ()=>CourseEntrySchema,
    "ForeignLanguageBackgroundSchema",
    ()=>ForeignLanguageBackgroundSchema,
    "InProgressCourseSchema",
    ()=>InProgressCourseSchema,
    "PlannedCourseSchema",
    ()=>PlannedCourseSchema,
    "ProgramEnrollmentSchema",
    ()=>ProgramEnrollmentSchema,
    "SemesterSchema",
    ()=>SemesterSchema,
    "StudentRecordSchema",
    ()=>StudentRecordSchema,
    "TransferCourseSchema",
    ()=>TransferCourseSchema,
    "WithdrawnCourseSchema",
    ()=>WithdrawnCourseSchema,
    "attemptCount",
    ()=>attemptCount,
    "completedCourses",
    ()=>completedCourses,
    "effectiveCourses",
    ()=>effectiveCourses,
    "gradePoints",
    ()=>gradePoints,
    "inMajorGPA",
    ()=>inMajorGPA,
    "isFailingGrade",
    ()=>isFailingGrade,
    "meetsMinGrade",
    ()=>meetsMinGrade,
    "overallGPA",
    ()=>overallGPA,
    "parseStudentRecord",
    ()=>parseStudentRecord,
    "totalEffectiveCredits",
    ()=>totalEffectiveCredits
]);
/**
 * Student Record Schema
 * 
 * Defines the shape of a student record — the per-user data that the audit
 * engine evaluates against a Program definition.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/program.ts [app-rsc] (ecmascript)");
;
;
const SemesterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^(fall|spring|summer|winter)_\d{4}$/, {
    message: 'Semester must be like "fall_2024"'
});
const CatalogYearSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\d{4}-\d{4}$/, "Format: 'YYYY-YYYY'");
const CompletedCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("completed"),
    course: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"],
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    grade: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GradeSchema"],
    semester: SemesterSchema,
    /** True if this satisfied a "Pass/Fail" registration (NOT PUT IN GPA) */ passFail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().default(false)
});
const InProgressCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("in_progress"),
    course: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"],
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    semester: SemesterSchema
});
const PlannedCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("planned"),
    course: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"],
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    semester: SemesterSchema
});
const TransferCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("transfer"),
    course: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    credits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    vtEquivalent: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"],
    source: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "transfer",
        "ap",
        "ib",
        "dual_enrollment",
        "clep",
        "credit_by_exam"
    ]),
    semester: SemesterSchema.optional()
});
const WithdrawnCourseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("withdrawn"),
    course: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"],
    semester: SemesterSchema,
    withdrawalDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const CourseEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].discriminatedUnion("status", [
    CompletedCourseSchema,
    InProgressCourseSchema,
    PlannedCourseSchema,
    TransferCourseSchema,
    WithdrawnCourseSchema
]);
const AdvisorApprovalSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "substitution",
        "waiver",
        "elective_approval"
    ]),
    /** The requirement ID this approval applies to (matches Program requirement id). */ forRequirement: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    /** Course being substituted-for */ substitutesCourse: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"].optional(),
    /** Course being used in its place */ withCourse: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CourseCodeSchema"].optional(),
    approvedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    approvedDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const ForeignLanguageBackgroundSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    language: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    yearsHighSchool: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional(),
    collegeCredits: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative().optional(),
    /** Placement test level achieved, e.g. 2106. */ placementLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional()
});
const AdmissionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    foreignLanguageBackground: ForeignLanguageBackgroundSchema.optional()
});
const ProgramEnrollmentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    programId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "major",
        "minor",
        "concentration"
    ]),
    declaredDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const StudentRecordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    studentId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    displayName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    catalogYear: CatalogYearSchema,
    /** Year for schema */ enrolledSemester: SemesterSchema,
    expectedGraduation: SemesterSchema.optional(),
    programs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(ProgramEnrollmentSchema).min(1),
    admissions: AdmissionsSchema.default({}),
    courseRecord: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(CourseEntrySchema).default([]),
    advisorApprovals: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(AdvisorApprovalSchema).default([])
});
function parseStudentRecord(input) {
    const result = StudentRecordSchema.safeParse(input);
    if (!result.success) {
        const issues = result.error.issues.map((i)=>`  • ${i.path.join(".")}: ${i.message}`).join("\n");
        throw new Error(`Student record validation failed:\n${issues}`);
    }
    return result.data;
}
function completedCourses(r) {
    return r.courseRecord.filter((c)=>c.status === "completed");
}
function effectiveCourses(r) {
    const out = [];
    for (const c of r.courseRecord){
        if (c.status === "completed" && !isFailingGrade(c.grade)) {
            out.push({
                course: c.course,
                credits: c.credits,
                source: "completed"
            });
        } else if (c.status === "in_progress") {
            out.push({
                course: c.course,
                credits: c.credits,
                source: "in_progress"
            });
        } else if (c.status === "transfer") {
            out.push({
                course: c.vtEquivalent,
                credits: c.credits,
                source: "transfer"
            });
        }
    }
    return out;
}
function attemptCount(r, courseCode) {
    return r.courseRecord.filter((c)=>{
        if (c.status === "completed") return c.course === courseCode;
        if (c.status === "in_progress") return c.course === courseCode;
        if (c.status === "withdrawn") return c.course === courseCode;
        return false;
    }).length;
}
function totalEffectiveCredits(r) {
    return effectiveCourses(r).reduce((sum, c)=>sum + c.credits, 0);
}
function gradePoints(grade) {
    // Pass and non-graded entries don't enter GPA
    if (grade === "P") return null;
    const table = {
        "A": 4.0,
        "A-": 3.7,
        "B+": 3.3,
        "B": 3.0,
        "B-": 2.7,
        "C+": 2.3,
        "C": 2.0,
        "C-": 1.7,
        "D+": 1.3,
        "D": 1.0,
        "D-": 0.7,
        "F": 0.0,
        "P": 0.0
    };
    return table[grade];
}
function isFailingGrade(grade) {
    return grade === "F";
}
function overallGPA(r) {
    let qualityPoints = 0;
    let attemptedCredits = 0;
    for (const c of completedCourses(r)){
        if (c.passFail) continue;
        const gp = gradePoints(c.grade);
        if (gp === null) continue;
        qualityPoints += gp * c.credits;
        attemptedCredits += c.credits;
    }
    if (attemptedCredits === 0) return 0;
    return qualityPoints / attemptedCredits;
}
function inMajorGPA(r, subject, exclusions = []) {
    const excluded = new Set(exclusions);
    let qualityPoints = 0;
    let attemptedCredits = 0;
    for (const c of completedCourses(r)){
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
function meetsMinGrade(actual, required) {
    const a = gradePoints(actual);
    const r = gradePoints(required);
    if (a === null || r === null) return actual === required;
    return a >= r;
}
}),
"[project]/lib/engine/audit-result.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Audit Engine — Result Types
 *
 * This is the contract between the dispatcher, every evaluator, and any
 * consumer (CLI, UI, API)
 */ __turbopack_context__.s([
    "lookupGrade",
    ()=>lookupGrade
]);
function lookupGrade(student, courseCode) {
    let found = null;
    for (const entry of student.courseRecord){
        if (entry.status === "completed" && entry.course === courseCode) {
            found = entry.grade;
        }
    }
    return found;
}
}),
"[project]/lib/engine/evaluators/exact.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateExact",
    ()=>evaluateExact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$audit$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/audit-result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/student.ts [app-rsc] (ecmascript)");
;
;
function evaluateExact(ctx, req) {
    // Build the set of acceptable course codes (primary + substitutes + advisor-approved swaps).
    const candidates = new Set([
        req.course,
        ...req.substitutes
    ]);
    for (const approval of ctx.approvals){
        if (approval.type === "substitution" && approval.forRequirement === req.id && approval.withCourse) {
            candidates.add(approval.withCourse);
        }
    }
    // Find the first claimable match.
    let match;
    for (const course of ctx.courses){
        if (!candidates.has(course.course)) continue;
        // noDoubleCounting bypasses allow-rules — strict single-claim only.
        const claimable = req.noDoubleCounting ? !course.consumed : ctx.canClaim(course);
        if (claimable) {
            match = course;
            break;
        }
    }
    if (!match) {
        const needed = [
            ...candidates
        ].join(" or ");
        return {
            status: "unsatisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: [],
            creditsApplied: 0,
            message: `${req.label ?? req.id}: not completed`,
            missing: needed
        };
    }
    // Grade check — skip for transfer (no VT grade) and in-progress (no grade yet).
    if (req.minGrade && match.source === "completed") {
        const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$audit$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lookupGrade"])(ctx.student, match.course);
        if (grade !== null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["meetsMinGrade"])(grade, req.minGrade)) {
            return {
                status: "unsatisfied",
                requirementId: req.id,
                label: req.label,
                coursesMatched: [
                    match.course
                ],
                creditsApplied: 0,
                message: `${req.label ?? req.id}: grade ${grade} does not meet minimum ${req.minGrade}`,
                missing: `${match.course} with grade ≥ ${req.minGrade}`
            };
        }
    }
    match.consumed = true;
    match.consumedBy = `${ctx.currentGroupId}:${req.id}`;
    return {
        status: "satisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [
            match.course
        ],
        creditsApplied: match.credits,
        message: `${req.label ?? req.id}: satisfied by ${match.course}`
    };
}
}),
"[project]/lib/engine/evaluators/zero-credit.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateZeroCredit",
    ()=>evaluateZeroCredit
]);
function evaluateZeroCredit(ctx, req) {
    // Accept the course regardless of consumed status
    const onTranscript = ctx.courses.some((c)=>c.course === req.course);
    // Also accept a waiver approval
    const waived = ctx.approvals.some((a)=>a.type === "waiver" && a.forRequirement === req.id);
    if (onTranscript || waived) {
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: [
                req.course
            ],
            creditsApplied: 0,
            message: waived ? `${req.label ?? req.id}: waived by advisor` : `${req.label ?? req.id}: ${req.course} on transcript`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: ${req.course} not on transcript`,
        missing: req.course
    };
}
}),
"[project]/lib/engine/evaluators/course-sequence.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateCourseSequence",
    ()=>evaluateCourseSequence
]);
function evaluateCourseSequence(ctx, req) {
    const matches = [];
    for (const code of req.courses){
        const found = ctx.courses.find((c)=>c.course === code && ctx.canClaim(c));
        if (!found) {
            const claimed = matches.map((m)=>m.course);
            const missing = req.courses.filter((c)=>!claimed.includes(c));
            return {
                status: "unsatisfied",
                requirementId: req.id,
                label: req.label,
                coursesMatched: [],
                creditsApplied: 0,
                message: `${req.label ?? req.id}: sequence incomplete`,
                missing: missing.join(" + ")
            };
        }
        matches.push(found);
    }
    // All found — claim atomically.
    for (const m of matches){
        m.consumed = true;
        m.consumedBy = `${ctx.currentGroupId}:${req.id}`;
    }
    const creditsApplied = matches.reduce((sum, m)=>sum + m.credits, 0);
    return {
        status: "satisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: matches.map((m)=>m.course),
        creditsApplied,
        message: `${req.label ?? req.id}: satisfied by ${matches.map((m)=>m.course).join(" + ")}`
    };
}
}),
"[project]/lib/engine/evaluators/one-of.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateOneOf",
    ()=>evaluateOneOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$audit$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/audit-result.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/student.ts [app-rsc] (ecmascript)");
;
;
function evaluateOneOf(ctx, req) {
    for (const option of req.options){
        if ("course" in option) {
            // Single-course option.
            const match = ctx.courses.find((c)=>c.course === option.course && ctx.canClaim(c));
            if (!match) continue;
            // Grade check.
            if (req.minGrade && match.source === "completed") {
                const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$audit$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lookupGrade"])(ctx.student, match.course);
                if (grade !== null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["meetsMinGrade"])(grade, req.minGrade)) continue;
            }
            match.consumed = true;
            match.consumedBy = `${ctx.currentGroupId}:${req.id}`;
            return {
                status: "satisfied",
                requirementId: req.id,
                label: req.label,
                coursesMatched: [
                    match.course
                ],
                creditsApplied: match.credits,
                message: `${req.label ?? req.id}: satisfied by ${match.course}`
            };
        } else {
            // Sequence option — atomic: all courses must be claimable.
            const sequenceMatches = [];
            let allFound = true;
            for (const code of option.sequence){
                const found = ctx.courses.find((c)=>c.course === code && ctx.canClaim(c));
                if (!found) {
                    allFound = false;
                    break;
                }
                sequenceMatches.push(found);
            }
            if (!allFound) continue;
            // Grade check on the first course in the sequence (sequences rarely have minGrade,
            // but honor it if set).
            if (req.minGrade) {
                const firstCompleted = sequenceMatches.find((m)=>m.source === "completed");
                if (firstCompleted) {
                    const grade = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$audit$2d$result$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lookupGrade"])(ctx.student, firstCompleted.course);
                    if (grade !== null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["meetsMinGrade"])(grade, req.minGrade)) continue;
                }
            }
            for (const m of sequenceMatches){
                m.consumed = true;
                m.consumedBy = `${ctx.currentGroupId}:${req.id}`;
            }
            const creditsApplied = sequenceMatches.reduce((sum, m)=>sum + m.credits, 0);
            return {
                status: "satisfied",
                requirementId: req.id,
                label: req.label,
                coursesMatched: sequenceMatches.map((m)=>m.course),
                creditsApplied,
                message: `${req.label ?? req.id}: satisfied by ${sequenceMatches.map((m)=>m.course).join(" + ")}`
            };
        }
    }
    // No option satisfied.
    const optionLabels = req.options.map((o)=>"course" in o ? o.course : o.sequence.join(" + ")).join(" | ");
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no option satisfied`,
        missing: optionLabels
    };
}
}),
"[project]/lib/engine/evaluators/one-from-list.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateOneFromList",
    ()=>evaluateOneFromList
]);
function evaluateOneFromList(ctx, req) {
    for (const code of req.courses){
        const match = ctx.courses.find((c)=>c.course === code && ctx.canClaim(c));
        if (!match) continue;
        match.consumed = true;
        match.consumedBy = `${ctx.currentGroupId}:${req.id}`;
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: [
                match.course
            ],
            creditsApplied: match.credits,
            message: `${req.label ?? req.id}: satisfied by ${match.course}`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: none of the listed courses completed`,
        missing: req.courses.join(", ")
    };
}
}),
"[project]/lib/engine/evaluators/pool-helpers.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pool matching helpers — pure functions shared by credits-from-pool and
 * aggregate-credits. No side effects, no mutable state.
 */ __turbopack_context__.s([
    "courseMatchesPool",
    ()=>courseMatchesPool,
    "extractLevel",
    ()=>extractLevel,
    "extractSubject",
    ()=>extractSubject
]);
function extractSubject(courseCode) {
    return courseCode.split(" ")[0];
}
function extractLevel(courseCode) {
    return parseInt(courseCode.split(" ")[1], 10);
}
function courseMatchesPool(courseCode, pool, pathwaysMap = new Map()) {
    switch(pool.type){
        case "explicit_list":
            return pool.courses.includes(courseCode);
        case "rule_based":
            {
                if (pool.excluded.includes(courseCode)) return false;
                if (pool.additionalAllowed.includes(courseCode)) return true;
                const subject = extractSubject(courseCode);
                const level = extractLevel(courseCode);
                for (const rule of pool.rules){
                    let matches = true;
                    if (rule.subject !== undefined && rule.subject !== subject) matches = false;
                    if (rule.subjects !== undefined && !rule.subjects.includes(subject)) matches = false;
                    if (rule.minLevel !== undefined && level < rule.minLevel) matches = false;
                    if (rule.maxLevel !== undefined && level > rule.maxLevel) matches = false;
                    if (matches) return true;
                }
                return false;
            }
        case "pathways_designated":
            {
                const concepts = pathwaysMap.get(courseCode);
                return concepts?.includes(pool.concept) ?? false;
            }
        case "exclusion_based":
            {
                const subject = extractSubject(courseCode);
                if (pool.excludedSubjects.includes(subject)) return false;
                if (pool.excludedCourses.includes(courseCode)) return false;
                return true;
            }
    }
}
}),
"[project]/lib/engine/evaluators/foreign-language.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateForeignLanguage",
    ()=>evaluateForeignLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/pool-helpers.ts [app-rsc] (ecmascript)");
;
// Maps canonical language names to VT subject prefixes.
const LANGUAGE_PREFIXES = {
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
    korean: "KOR"
};
function subjectForLanguage(languageFamily) {
    return LANGUAGE_PREFIXES[languageFamily.toLowerCase()] ?? null;
}
function evaluateForeignLanguage(ctx, req) {
    const placementLevel = ctx.student.admissions.foreignLanguageBackground?.placementLevel ?? 0;
    // Placement at or above minLevel satisfies the requirement outright.
    if (placementLevel >= req.minLevel) {
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: [],
            creditsApplied: 0,
            message: `${req.label ?? req.id}: satisfied by placement (level ${placementLevel})`
        };
    }
    // Otherwise find unclaimed courses at or above minLevel.
    // "any" means any recognized language subject — not literally any subject code.
    const knownLanguageSubjects = new Set(Object.values(LANGUAGE_PREFIXES));
    const subjectFilter = req.languageFamily !== "any" ? subjectForLanguage(req.languageFamily) : null;
    const eligible = ctx.courses.filter((c)=>{
        if (!ctx.canClaim(c)) return false;
        const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractLevel"])(c.course);
        if (isNaN(level) || level < req.minLevel) return false;
        if (subjectFilter !== null) {
            // Specific language family required.
            if (!c.course.startsWith(`${subjectFilter} `)) return false;
        } else {
            // "any" language — must still be a recognized language subject.
            if (!knownLanguageSubjects.has((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractSubject"])(c.course))) return false;
        }
        return true;
    });
    let creditsApplied = 0;
    const claimed = [];
    for (const course of eligible){
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
            message: `${req.label ?? req.id}: satisfied by ${claimed.join(", ")}`
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
            missing: `${req.credits - creditsApplied} more credits at level ≥ ${req.minLevel}`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no language course at level ≥ ${req.minLevel} found`,
        missing: `${req.credits} credits of ${req.languageFamily} at level ≥ ${req.minLevel}`
    };
}
}),
"[project]/lib/engine/evaluators/credits-from-list.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateCreditsFromList",
    ()=>evaluateCreditsFromList
]);
function evaluateCreditsFromList(ctx, req) {
    let creditsApplied = 0;
    const claimed = [];
    for (const code of req.courses){
        if (creditsApplied >= req.credits) break;
        const match = ctx.courses.find((c)=>c.course === code && ctx.canClaim(c));
        if (!match) continue;
        match.consumed = true;
        match.consumedBy = `${ctx.currentGroupId}:${req.id}`;
        creditsApplied += match.credits;
        claimed.push(match.course);
    }
    const meetsMinCourses = req.minCourses === undefined || claimed.length >= req.minCourses;
    if (creditsApplied >= req.credits && meetsMinCourses) {
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: claimed,
            creditsApplied,
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits satisfied`
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
            missing: `${req.minCourses - claimed.length} more courses from the list`
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
            missing: `${req.credits - creditsApplied} more credits from the approved list`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no matching courses completed`,
        missing: `${req.credits} credits from the approved list`
    };
}
}),
"[project]/lib/engine/evaluators/credits-from-pool.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateCreditsFromPool",
    ()=>evaluateCreditsFromPool
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/pool-helpers.ts [app-rsc] (ecmascript)");
;
function evaluateCreditsFromPool(ctx, req) {
    // For pathways_designated pools: we have no catalog data yet, so we can't
    // match courses. Return a partial/unsatisfied with an informative message
    const isPathways = req.pool.type === "pathways_designated";
    let creditsApplied = 0;
    const claimed = [];
    for (const course of ctx.courses){
        if (creditsApplied >= req.credits) break;
        if (!ctx.canClaim(course)) continue;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["courseMatchesPool"])(course.course, req.pool)) continue;
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
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits satisfied`
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
            missing: `${req.minCourses - claimed.length} more courses from pool`
        };
    }
    const pathwaysNote = isPathways ? " (course catalog integration required for Pathways matching)" : "";
    if (creditsApplied > 0) {
        return {
            status: "partial",
            requirementId: req.id,
            label: req.label,
            coursesMatched: claimed,
            creditsApplied,
            creditsNeeded: req.credits - creditsApplied,
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits${pathwaysNote}`,
            missing: `${req.credits - creditsApplied} more credits from pool`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no matching courses completed${pathwaysNote}`,
        missing: `${req.credits} credits from pool`
    };
}
}),
"[project]/lib/engine/evaluators/choose-n-from-groups.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateChooseNFromGroups",
    ()=>evaluateChooseNFromGroups
]);
/** Returns all combinations of size k from arr. */ function combinations(arr, k) {
    if (k === 0) return [
        []
    ];
    if (arr.length < k) return [];
    const [first, ...rest] = arr;
    const withFirst = combinations(rest, k - 1).map((c)=>[
            first,
            ...c
        ]);
    const withoutFirst = combinations(rest, k);
    return [
        ...withFirst,
        ...withoutFirst
    ];
}
function evaluateChooseNFromGroups(ctx, req) {
    // For each group, find which courses are claimable.
    const availableByGroup = req.groups.map((group)=>({
            group,
            available: ctx.courses.filter((c)=>group.courses.includes(c.course) && ctx.canClaim(c))
        }));
    // Try combinations of groupsToChoose groups and pick the first where
    // each group has enough available courses.
    const groupCombos = combinations(availableByGroup, req.groupsToChoose);
    let chosenCombo = null;
    for (const combo of groupCombos){
        if (combo.every((g)=>g.available.length >= req.coursesPerGroup)) {
            chosenCombo = combo;
            break;
        }
    }
    if (chosenCombo !== null) {
        const claimed = [];
        for (const { available } of chosenCombo){
            let taken = 0;
            for (const course of available){
                if (taken >= req.coursesPerGroup) break;
                course.consumed = true;
                course.consumedBy = `${ctx.currentGroupId}:${req.id}`;
                claimed.push(course);
                taken++;
            }
        }
        const creditsApplied = claimed.reduce((sum, c)=>sum + c.credits, 0);
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: claimed.map((c)=>c.course),
            creditsApplied,
            message: `${req.label ?? req.id}: satisfied (${req.groupsToChoose} groups × ${req.coursesPerGroup} courses)`
        };
    }
    // Count how many groups have enough.
    const groupsSatisfiable = availableByGroup.filter((g)=>g.available.length >= req.coursesPerGroup).length;
    if (groupsSatisfiable > 0) {
        return {
            status: "partial",
            requirementId: req.id,
            label: req.label,
            coursesMatched: [],
            creditsApplied: 0,
            creditsNeeded: req.credits,
            message: `${req.label ?? req.id}: ${groupsSatisfiable}/${req.groupsToChoose} groups satisfiable`,
            missing: `${req.groupsToChoose - groupsSatisfiable} more groups with ≥ ${req.coursesPerGroup} courses each`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no distributional groups satisfied`,
        missing: `${req.groupsToChoose} groups with ≥ ${req.coursesPerGroup} courses each`
    };
}
}),
"[project]/lib/engine/evaluators/aggregate-credits.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateAggregateCredits",
    ()=>evaluateAggregateCredits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/pool-helpers.ts [app-rsc] (ecmascript)");
;
function evaluateAggregateCredits(ctx, req) {
    const matched = [];
    let creditsApplied = 0;
    for (const course of ctx.courses){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$pool$2d$helpers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["courseMatchesPool"])(course.course, req.pool)) continue;
        matched.push(course.course);
        creditsApplied += course.credits;
    }
    if (creditsApplied >= req.credits) {
        return {
            status: "satisfied",
            requirementId: req.id,
            label: req.label,
            coursesMatched: matched,
            creditsApplied,
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits across degree`
        };
    }
    if (creditsApplied > 0) {
        return {
            status: "partial",
            requirementId: req.id,
            label: req.label,
            coursesMatched: matched,
            creditsApplied,
            creditsNeeded: req.credits - creditsApplied,
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} credits across degree`,
            missing: `${req.credits - creditsApplied} more qualifying credits`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: 0/${req.credits} credits`,
        missing: `${req.credits} credits matching pool`
    };
}
}),
"[project]/lib/engine/evaluators/free-credits.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateFreeCredits",
    ()=>evaluateFreeCredits
]);
function evaluateFreeCredits(ctx, req) {
    let creditsApplied = 0;
    const claimed = [];
    for (const course of ctx.courses){
        if (creditsApplied >= req.credits) break;
        if (course.consumed) continue;
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
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} free credits satisfied`
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
            message: `${req.label ?? req.id}: ${creditsApplied}/${req.credits} free credits`,
            missing: `${req.credits - creditsApplied} more credits (any subject)`
        };
    }
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: no remaining credits available`,
        missing: `${req.credits} credits (any subject)`
    };
}
}),
"[project]/lib/engine/evaluators/compound.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "evaluateCompound",
    ()=>evaluateCompound
]);
function evaluateCompound(ctx, req) {
    return {
        status: "unsatisfied",
        requirementId: req.id,
        label: req.label,
        coursesMatched: [],
        creditsApplied: 0,
        message: `${req.label ?? req.id}: compound evaluator not yet implemented`,
        missing: `${req.credits} credits satisfying all sub-requirements`
    };
}
}),
"[project]/lib/engine/dispatcher.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Audit Dispatcher — orchestrates the full degree audit.
 */ __turbopack_context__.s([
    "runAudit",
    ()=>runAudit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/student.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$exact$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/exact.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$zero$2d$credit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/zero-credit.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$course$2d$sequence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/course-sequence.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$one$2d$of$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/one-of.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$one$2d$from$2d$list$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/one-from-list.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$foreign$2d$language$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/foreign-language.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$credits$2d$from$2d$list$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/credits-from-list.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$credits$2d$from$2d$pool$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/credits-from-pool.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$choose$2d$n$2d$from$2d$groups$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/choose-n-from-groups.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$aggregate$2d$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/aggregate-credits.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$free$2d$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/free-credits.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$compound$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/evaluators/compound.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
// Tier ordering — lower number = processed first
const TIER = {
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
    aggregate_credits: 6,
    free_credits: 7
};
// canClaim factory — encapsulates double-count rule logic
function buildCanClaim(currentGroupId, rules) {
    return (course)=>{
        if (!course.consumed) return true;
        // consumedBy format: "groupId:requirementId"
        const colonIdx = course.consumedBy?.indexOf(":") ?? -1;
        if (colonIdx === -1) return true;
        const sourceGroup = course.consumedBy.slice(0, colonIdx);
        const sourceReqId = course.consumedBy.slice(colonIdx + 1);
        // Same group can always re-examine (shouldn't happen in practice).
        if (sourceGroup === currentGroupId) return true;
        const pairKey = [
            sourceGroup,
            currentGroupId
        ].sort().join("::");
        const allowRule = rules.find((r)=>{
            if (r.type !== "allow") return false;
            return [
                ...r.between
            ].sort().join("::") === pairKey;
        });
        if (!allowRule) return false;
        // `except` contains requirement IDs that are excluded from double-counting.
        if (allowRule.except.includes(sourceReqId)) return false;
        return true;
    };
}
// Evaluator dispatch
function dispatch(ctx, req) {
    switch(req.type){
        case "exact":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$exact$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateExact"])(ctx, req);
        case "zero_credit":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$zero$2d$credit$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateZeroCredit"])(ctx, req);
        case "course_sequence":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$course$2d$sequence$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateCourseSequence"])(ctx, req);
        case "one_of":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$one$2d$of$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateOneOf"])(ctx, req);
        case "one_from_list":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$one$2d$from$2d$list$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateOneFromList"])(ctx, req);
        case "foreign_language":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$foreign$2d$language$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateForeignLanguage"])(ctx, req);
        case "credits_from_list":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$credits$2d$from$2d$list$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateCreditsFromList"])(ctx, req);
        case "credits_from_pool":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$credits$2d$from$2d$pool$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateCreditsFromPool"])(ctx, req);
        case "choose_n_from_groups":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$choose$2d$n$2d$from$2d$groups$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateChooseNFromGroups"])(ctx, req);
        case "aggregate_credits":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$aggregate$2d$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateAggregateCredits"])(ctx, req);
        case "free_credits":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$free$2d$credits$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateFreeCredits"])(ctx, req);
        case "compound":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$evaluators$2f$compound$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["evaluateCompound"])(ctx, req);
    }
}
function runAudit(program, student) {
    // Build mutable AuditCourse pool, deduplicating by VT code.
    const rawCourses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["effectiveCourses"])(student);
    const seenCodes = new Map();
    for (const ec of rawCourses){
        const existing = seenCodes.get(ec.course);
        if (!existing) {
            seenCodes.set(ec.course, {
                ...ec,
                consumed: false
            });
        } else {
            // Prefer completed over transfer; prefer higher credit value on tie.
            const prefer = ec.source === "completed" && existing.source !== "completed" || ec.credits > existing.credits;
            if (prefer) seenCodes.set(ec.course, {
                ...ec,
                consumed: false
            });
        }
    }
    const courses = [
        ...seenCodes.values()
    ];
    const tieredPairs = [];
    const aggregatePairs = [];
    const freeCreditPairs = [];
    for (const group of program.requirementGroups){
        for (const req of group.requirements){
            if (req.type === "aggregate_credits") {
                aggregatePairs.push({
                    groupId: group.id,
                    req
                });
            } else if (req.type === "free_credits") {
                freeCreditPairs.push({
                    groupId: group.id,
                    req
                });
            } else {
                tieredPairs.push({
                    groupId: group.id,
                    req
                });
            }
        }
    }
    // Sort tiered pairs by tier then by original order
    tieredPairs.sort((a, b)=>TIER[a.req.type] - TIER[b.req.type]);
    // Step 3: Process tiered requirements.
    const resultsByGroup = new Map();
    for (const group of program.requirementGroups){
        resultsByGroup.set(group.id, []);
    }
    const processQueue = (pairs)=>{
        for (const { groupId, req } of pairs){
            const ctx = {
                program,
                student,
                courses,
                approvals: student.advisorApprovals,
                currentGroupId: groupId,
                canClaim: buildCanClaim(groupId, program.doubleCountRules)
            };
            const result = dispatch(ctx, req);
            resultsByGroup.get(groupId).push(result);
        }
    };
    processQueue(tieredPairs);
    // aggregate_credits — post-consumption count, non-consuming
    processQueue(aggregatePairs);
    // free_credits — mop-up
    processQueue(freeCreditPairs);
    // GPA checks
    const gpaChecks = [];
    const actualOverall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["overallGPA"])(student);
    gpaChecks.push({
        label: "Overall GPA",
        required: program.gpaRequirements.overall,
        actual: Math.round(actualOverall * 1000) / 1000,
        passed: actualOverall >= program.gpaRequirements.overall
    });
    if (program.gpaRequirements.inMajor !== undefined && program.gpaRequirements.inMajorSubject) {
        const actualInMajor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inMajorGPA"])(student, program.gpaRequirements.inMajorSubject, program.policies.inMajorGPAExclusions);
        gpaChecks.push({
            label: `In-Major GPA (${program.gpaRequirements.inMajorSubject})`,
            required: program.gpaRequirements.inMajor,
            actual: Math.round(actualInMajor * 1000) / 1000,
            passed: actualInMajor >= program.gpaRequirements.inMajor
        });
    }
    // Roll up GroupResults
    const groupResults = program.requirementGroups.map((group)=>{
        const results = resultsByGroup.get(group.id) ?? [];
        const creditsApplied = results.reduce((sum, r)=>sum + r.creditsApplied, 0);
        const satisfied = results.length > 0 && results.every((r)=>r.status === "satisfied");
        return {
            groupId: group.id,
            label: group.label,
            creditTarget: group.credits,
            creditsApplied,
            satisfied,
            requirementResults: results
        };
    });
    const eligible = groupResults.every((g)=>g.satisfied) && gpaChecks.every((g)=>g.passed);
    const allResults = groupResults.flatMap((g)=>g.requirementResults);
    return {
        studentId: student.studentId,
        programId: program.programId,
        timestamp: new Date().toISOString(),
        groupResults,
        gpaChecks,
        eligible,
        summary: {
            totalCreditsApplied: groupResults.reduce((sum, g)=>sum + g.creditsApplied, 0),
            totalCreditsRequired: program.totalCredits,
            groupsSatisfied: groupResults.filter((g)=>g.satisfied).length,
            groupsTotal: groupResults.length,
            requirementsSatisfied: allResults.filter((r)=>r.status === "satisfied").length,
            requirementsTotal: allResults.length
        }
    };
}
}),
"[project]/lib/engine/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$dispatcher$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/dispatcher.ts [app-rsc] (ecmascript)");
;
}),
"[project]/components/audit/ProgressPanel.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProgressPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function ProgressPanel({ audit }) {
    const { summary, gpaChecks, eligible } = audit;
    const pct = Math.min(100, Math.round(summary.totalCreditsApplied / summary.totalCreditsRequired * 100));
    const overallGpa = gpaChecks.find((g)=>g.label === "Overall GPA");
    const inMajorGpa = gpaChecks.find((g)=>g.label.startsWith("In-Major"));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white border border-stone-200 rounded-lg p-6 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-baseline mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-stone-600",
                                children: "Credits applied"
                            }, void 0, false, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 18,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono tabular-nums text-sm text-stone-900",
                                children: [
                                    summary.totalCreditsApplied,
                                    " / ",
                                    summary.totalCreditsRequired
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 19,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-stone-100 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-maroon rounded-full",
                            style: {
                                width: `${pct}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/audit/ProgressPanel.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-right mt-1 font-mono tabular-nums text-xs text-stone-600",
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/audit/ProgressPanel.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-6 items-center pt-1",
                children: [
                    overallGpa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-stone-600",
                                children: "Overall GPA "
                            }, void 0, false, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono tabular-nums font-medium text-stone-900",
                                children: overallGpa.actual.toFixed(3)
                            }, void 0, false, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    inMajorGpa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-stone-600",
                                children: [
                                    inMajorGpa.label,
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono tabular-nums font-medium text-stone-900",
                                children: inMajorGpa.actual.toFixed(3)
                            }, void 0, false, {
                                fileName: "[project]/components/audit/ProgressPanel.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `px-3 py-1 rounded-full text-xs font-medium border ${eligible ? "bg-green-50 text-success border-green-200" : "bg-stone-100 text-stone-600 border-stone-200"}`,
                            children: eligible ? "Eligible to graduate" : "Not yet eligible"
                        }, void 0, false, {
                            fileName: "[project]/components/audit/ProgressPanel.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/audit/ProgressPanel.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/audit/ProgressPanel.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/audit/ProgressPanel.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/audit/RequirementRow.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RequirementRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-rsc] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dashed$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDashed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dashed.mjs [app-rsc] (ecmascript) <export default as CircleDashed>");
;
;
function borderClass(status) {
    if (status === "satisfied") return "border-l-2 border-success";
    if (status === "partial") return "border-l-2 border-burnt";
    return "border-l-2 border-stone-200";
}
function StatusIcon({ status }) {
    if (status === "satisfied") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
        size: 14,
        className: "text-success shrink-0 mt-0.5"
    }, void 0, false, {
        fileName: "[project]/components/audit/RequirementRow.tsx",
        lineNumber: 12,
        columnNumber: 12
    }, this);
    if (status === "partial") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dashed$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDashed$3e$__["CircleDashed"], {
        size: 14,
        className: "text-burnt shrink-0 mt-0.5"
    }, void 0, false, {
        fileName: "[project]/components/audit/RequirementRow.tsx",
        lineNumber: 14,
        columnNumber: 12
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-stone-400 text-sm leading-none mt-0.5 w-3.5 text-center",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/components/audit/RequirementRow.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
function RequirementRow({ result }) {
    const isSatisfied = result.status === "satisfied";
    const isPartial = result.status === "partial";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-start gap-3 pl-3 py-2 ${borderClass(result.status)}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                status: result.status
            }, void 0, false, {
                fileName: "[project]/components/audit/RequirementRow.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex items-baseline gap-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-sm text-stone-900",
                                        children: result.label ?? result.requirementId
                                    }, void 0, false, {
                                        fileName: "[project]/components/audit/RequirementRow.tsx",
                                        lineNumber: 32,
                                        columnNumber: 13
                                    }, this),
                                    result.coursesMatched.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-stone-500 font-mono",
                                        children: result.coursesMatched.join(", ")
                                    }, void 0, false, {
                                        fileName: "[project]/components/audit/RequirementRow.tsx",
                                        lineNumber: 36,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/audit/RequirementRow.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 text-right",
                                children: [
                                    isSatisfied && result.creditsApplied > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono tabular-nums text-sm text-stone-600",
                                        children: [
                                            result.creditsApplied,
                                            " cr"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/audit/RequirementRow.tsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this),
                                    isPartial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono tabular-nums text-sm text-burnt",
                                        children: [
                                            result.creditsApplied,
                                            " /",
                                            " ",
                                            result.creditsApplied + result.creditsNeeded,
                                            " cr"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/audit/RequirementRow.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/audit/RequirementRow.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/RequirementRow.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    result.status === "unsatisfied" && result.missing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-stone-500 mt-0.5 truncate",
                        children: result.missing
                    }, void 0, false, {
                        fileName: "[project]/components/audit/RequirementRow.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    isPartial && result.missing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-stone-500 mt-0.5",
                        children: result.missing
                    }, void 0, false, {
                        fileName: "[project]/components/audit/RequirementRow.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/audit/RequirementRow.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/audit/RequirementRow.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/audit/RequirementGroup.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RequirementGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$RequirementRow$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/audit/RequirementRow.tsx [app-rsc] (ecmascript)");
;
;
function RequirementGroup({ group }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-serif text-2xl font-semibold text-stone-900",
                        children: group.label
                    }, void 0, false, {
                        fileName: "[project]/components/audit/RequirementGroup.tsx",
                        lineNumber: 8,
                        columnNumber: 9
                    }, this),
                    group.creditTarget !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono tabular-nums text-sm text-stone-600",
                        children: [
                            group.creditsApplied,
                            " / ",
                            group.creditTarget,
                            " cr"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/audit/RequirementGroup.tsx",
                        lineNumber: 12,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/audit/RequirementGroup.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                className: "border-stone-200 mb-4"
            }, void 0, false, {
                fileName: "[project]/components/audit/RequirementGroup.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-1",
                children: group.requirementResults.map((result)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$RequirementRow$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        result: result
                    }, result.requirementId, false, {
                        fileName: "[project]/components/audit/RequirementGroup.tsx",
                        lineNumber: 20,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/audit/RequirementGroup.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/audit/RequirementGroup.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/audit/[studentId]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/program.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schemas/student.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/engine/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$dispatcher$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/dispatcher.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$ProgressPanel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/audit/ProgressPanel.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$RequirementGroup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/audit/RequirementGroup.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
async function loadStudentById(studentId) {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "students");
    const files = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readdir"])(dir);
    for (const file of files){
        if (!file.endsWith(".json")) continue;
        const raw = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, file), "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.studentId === studentId) return parsed;
    }
    return null;
}
async function AuditPage({ params }) {
    const { studentId } = await params;
    // Scan data/students/ for a file whose studentId matches the URL param.
    const studentRaw = await loadStudentById(studentId);
    if (!studentRaw) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    const student = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseStudentRecord"])(studentRaw);
    // Load and parse program (first enrolled).
    const programId = student.programs[0].programId;
    const programRaw = JSON.parse(await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "programs", `${programId}.json`), "utf-8"));
    const program = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$program$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseProgram"])(programRaw);
    const audit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$dispatcher$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runAudit"])(program, student);
    // Compute unallocated courses — AuditResult has no unusedCourses field,
    // so we derive it by diffing effectiveCourses against all coursesMatched.
    const allMatchedCodes = new Set(audit.groupResults.flatMap((g)=>g.requirementResults).flatMap((r)=>r.coursesMatched));
    const unallocated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schemas$2f$student$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["effectiveCourses"])(student).map((c)=>c.course).filter((code)=>!allMatchedCodes.has(code));
    // Format expected graduation for display.
    const gradDisplay = student.expectedGraduation ? student.expectedGraduation.replace("_", " ") : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-serif text-4xl font-semibold text-stone-900",
                        children: student.displayName
                    }, void 0, false, {
                        fileName: "[project]/app/audit/[studentId]/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-stone-600",
                        children: [
                            program.programName,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mx-2 text-stone-300",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/app/audit/[studentId]/page.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            program.catalogYear,
                            gradDisplay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mx-2 text-stone-300",
                                        children: "·"
                                    }, void 0, false, {
                                        fileName: "[project]/app/audit/[studentId]/page.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this),
                                    "Expected ",
                                    gradDisplay
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/audit/[studentId]/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/audit/[studentId]/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$ProgressPanel$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                audit: audit
            }, void 0, false, {
                fileName: "[project]/app/audit/[studentId]/page.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            audit.groupResults.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$audit$2f$RequirementGroup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    group: group
                }, group.groupId, false, {
                    fileName: "[project]/app/audit/[studentId]/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)),
            unallocated.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-4 border-t border-stone-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide",
                        children: "Unallocated courses"
                    }, void 0, false, {
                        fileName: "[project]/app/audit/[studentId]/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-sm text-stone-500",
                        children: unallocated.join(", ")
                    }, void 0, false, {
                        fileName: "[project]/app/audit/[studentId]/page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/audit/[studentId]/page.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/audit/[studentId]/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/audit/[studentId]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/audit/[studentId]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__006hh-i._.js.map