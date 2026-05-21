/**
 * validate-programs
 * 
 * Loads every JSON file in data/programs/ and validates it against the
 * Zod schema in lib/schemas/program.ts
 *
 * Exit code 0 if all programs are valid, 1 otherwise. Intended to run in
 * CI on every PR and locally before pushing.
 *
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseProgram } from "../lib/schemas/program.ts";

const PROGRAMS_DIR = resolve(process.cwd(), "data/programs");

type Result =
  | { file: string; ok: true; programId: string; credits: number }
  | { file: string; ok: false; error: string };

function discoverProgramFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => join(dir, f))
      .filter((p) => statSync(p).isFile())
      .sort();
  } catch (err) {
    console.error(`Could not read ${dir}: ${(err as Error).message}`);
    process.exit(1);
  }
}

function validateOne(filePath: string): Result {
  const file = filePath.replace(`${process.cwd()}/`, "");
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch (err) {
    return { file, ok: false, error: `Cannot read file: ${(err as Error).message}` };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { file, ok: false, error: `Invalid JSON: ${(err as Error).message}` };
  }

  try {
    const program = parseProgram(parsed);
    return {
      file,
      ok: true,
      programId: program.programId,
      credits: program.totalCredits,
    };
  } catch (err) {
    return { file, ok: false, error: (err as Error).message };
  }
}

function main(): void {
  console.log(`Validating programs in ${PROGRAMS_DIR}\n`);

  const files = discoverProgramFiles(PROGRAMS_DIR);
  if (files.length === 0) {
    console.error("No program files found.");
    process.exit(1);
  }

  const results = files.map(validateOne);
  const failures = results.filter((r): r is Extract<Result, { ok: false }> => !r.ok);

  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.file}  →  ${r.programId} (${r.credits} credits)`);
    } else {
      console.log(`  ✗ ${r.file}`);
      console.log(`    ${r.error.replace(/\n/g, "\n    ")}`);
    }
  }

  console.log();
  if (failures.length > 0) {
    console.log(`✗ ${failures.length} of ${results.length} program(s) failed validation.`);
    process.exit(1);
  }

  console.log(`✓ All ${results.length} program(s) valid.`);
}

main();