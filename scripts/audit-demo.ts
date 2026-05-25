/**
 * CLI demo for the degree audit engine.
 */

import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { parseProgram } from "../lib/schemas/program.ts";
import { parseStudentRecord } from "../lib/schemas/student.ts";
import { runAudit } from "../lib/engine/index.ts";
import type { RequirementResult, GroupResult, GpaCheck } from "../lib/engine/index.ts";

const studentPath = process.argv[2];
if (!studentPath) {
  console.error("Usage: npx tsx scripts/audit-demo.ts <student-json-path>");
  process.exit(1);
}

// Load and parse student record.
const studentRaw = JSON.parse(readFileSync(resolve(studentPath), "utf-8"));
const student = parseStudentRecord(studentRaw);

// Derive program path from first enrolled program.
const programId = student.programs[0].programId;
const programPath = join("data", "programs", `${programId}.json`);
const programRaw = JSON.parse(readFileSync(resolve(programPath), "utf-8"));
const program = parseProgram(programRaw);

const result = runAudit(program, student);

// Formatting helpers

function statusTag(r: RequirementResult): string {
  if (r.status === "satisfied") return "[SATISFIED]";
  if (r.status === "partial")   return "[PARTIAL  ]";
  return                               "[MISSING  ]";
}

function formatRequirement(r: RequirementResult): string {
  const tag = statusTag(r);
  const base = `  ${tag} ${r.requirementId}${r.label ? ` — ${r.label}` : ""}`;
  if (r.status === "satisfied") {
    const courses = r.coursesMatched.length ? ` (${r.coursesMatched.join(", ")})` : "";
    return `${base}${courses} [${r.creditsApplied} cr]`;
  }
  if (r.status === "partial") {
    return `${base}: ${r.creditsApplied}/${r.creditsApplied + r.creditsNeeded} cr — missing: ${r.missing}`;
  }
  return `${base}: ${r.missing}`;
}

function formatGroup(g: GroupResult): string {
  const creditInfo = g.creditTarget !== undefined ? ` (${g.creditTarget} cr target)` : "";
  const header = `\n--- ${g.label}${creditInfo} ---`;
  const lines = g.requirementResults.map(formatRequirement);
  return [header, ...lines].join("\n");
}

function formatGpaCheck(g: GpaCheck): string {
  const tag = g.passed ? "[PASS]" : "[FAIL]";
  return `  ${tag} ${g.label}: ${g.actual.toFixed(3)} (required ≥ ${g.required.toFixed(2)})`;
}


// Output

console.log(`\n${"=".repeat(60)}`);
console.log(`Degree Audit: ${student.displayName}`);
console.log(`Program:      ${program.programName} (${program.programId})`);
console.log(`Timestamp:    ${result.timestamp}`);
console.log("=".repeat(60));

console.log("\n--- GPA Checks ---");
result.gpaChecks.forEach((g) => console.log(formatGpaCheck(g)));

result.groupResults.forEach((g) => console.log(formatGroup(g)));

const { summary } = result;
console.log(`\n${"=".repeat(60)}`);
console.log("SUMMARY");
console.log("=".repeat(60));
console.log(`Credits:       ${summary.totalCreditsApplied} / ${summary.totalCreditsRequired} required`);
console.log(`Groups:        ${summary.groupsSatisfied} / ${summary.groupsTotal} satisfied`);
console.log(`Requirements:  ${summary.requirementsSatisfied} / ${summary.requirementsTotal} satisfied`);
console.log(`Eligible:      ${result.eligible ? "YES" : "NOT ELIGIBLE"}`);
console.log();
