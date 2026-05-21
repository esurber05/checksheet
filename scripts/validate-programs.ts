/**
 * validate
 *
 * Loads every program JSON in data/programs/ and every student JSON in
 * data/students/ and validates each against its Zod schema.
 *
 * Exit code 0 if all valid, 1 otherwise. Runs in CI on every PR.
 *
 * Usage:  npm run validate
 *         npx tsx scripts/validate-programs.ts
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseProgram } from "../lib/schemas/program.ts";
import { parseStudentRecord } from "../lib/schemas/student.ts";

const ROOT = process.cwd();

type Result =
  | { kind: string; file: string; ok: true; summary: string }
  | { kind: string; file: string; ok: false; error: string };

function discover(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => join(dir, f))
    .filter((p) => statSync(p).isFile())
    .sort();
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function relative(p: string): string {
  return p.startsWith(`${ROOT}/`) ? p.slice(ROOT.length + 1) : p;
}

function validateProgram(filePath: string): Result {
  const file = relative(filePath);
  try {
    const program = parseProgram(readJson(filePath));
    return {
      kind: "program",
      file,
      ok: true,
      summary: `${program.programId} (${program.totalCredits} credits)`,
    };
  } catch (err) {
    return { kind: "program", file, ok: false, error: (err as Error).message };
  }
}

function validateStudent(filePath: string): Result {
  const file = relative(filePath);
  try {
    const student = parseStudentRecord(readJson(filePath));
    const programs = student.programs.map((p) => p.programId).join(", ");
    return {
      kind: "student",
      file,
      ok: true,
      summary: `${student.studentId} → ${programs}`,
    };
  } catch (err) {
    return { kind: "student", file, ok: false, error: (err as Error).message };
  }
}

function printResults(label: string, results: Result[]): number {
  if (results.length === 0) {
    console.log(`(no ${label} found)`);
    return 0;
  }
  console.log(`\n${label}:`);
  let failures = 0;
  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.file}  →  ${r.summary}`);
    } else {
      failures++;
      console.log(`  ✗ ${r.file}`);
      console.log(`    ${r.error.replace(/\n/g, "\n    ")}`);
    }
  }
  return failures;
}

function main(): void {
  const programFiles = discover(resolve(ROOT, "data/programs"));
  const studentFiles = discover(resolve(ROOT, "data/students"));

  const programResults = programFiles.map(validateProgram);
  const studentResults = studentFiles.map(validateStudent);

  const programFailures = printResults("Programs", programResults);
  const studentFailures = printResults("Students", studentResults);

  const total = programResults.length + studentResults.length;
  const failures = programFailures + studentFailures;

  console.log();
  if (failures > 0) {
    console.log(`✗ ${failures} of ${total} file(s) failed validation.`);
    process.exit(1);
  }
  console.log(`✓ All ${total} file(s) valid.`);
}

main();