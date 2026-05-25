/**
 * validate-catalog
 *
 * Loads every JSON file in data/catalog/by-subject/ and validates each
 * course entry against the CourseSchema.
 *
 * Exit code 0 if all valid (or no files found), 1 otherwise.
 * Runs in CI on every PR alongside the existing validate script.
 *
 * Usage:  npm run validate:catalog
 *         npx tsx scripts/validate-catalog.ts
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseCourse } from "../lib/schemas/course.ts";

const ROOT = process.cwd();

type Result =
  | { file: string; ok: true; summary: string }
  | { file: string; ok: false; error: string };

function discover(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => join(dir, f))
    .filter((p) => statSync(p).isFile())
    .sort();
}

function relative(p: string): string {
  return p.startsWith(`${ROOT}/`) ? p.slice(ROOT.length + 1) : p;
}

interface SubjectFile {
  subject?: string;
  catalogYear?: string;
  courses?: unknown[];
}

function validateSubjectFile(filePath: string): Result {
  const file = relative(filePath);
  try {
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as SubjectFile;

    if (!Array.isArray(raw.courses)) {
      throw new Error('Missing or invalid "courses" array');
    }

    const failures: string[] = [];
    for (const course of raw.courses) {
      try {
        parseCourse(course);
      } catch (err) {
        failures.push((err as Error).message);
      }
    }

    if (failures.length > 0) {
      throw new Error(`${failures.length} course(s) failed:\n${failures.join("\n")}`);
    }

    return {
      file,
      ok: true,
      summary: `${raw.subject ?? "?"} (${raw.catalogYear ?? "?"}) — ${raw.courses.length} courses`,
    };
  } catch (err) {
    return { file, ok: false, error: (err as Error).message };
  }
}

function main(): void {
  const catalogDir = resolve(ROOT, "data", "catalog", "by-subject");
  const files = discover(catalogDir);

  if (files.length === 0) {
    console.log("(no catalog files found — run npm run scrape:catalog first)");
    return;
  }

  const results = files.map(validateSubjectFile);

  console.log("\nCatalog files:");
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

  console.log();
  if (failures > 0) {
    console.log(`✗ ${failures} of ${results.length} file(s) failed validation.`);
    process.exit(1);
  }
  console.log(`✓ All ${results.length} file(s) valid.`);
}

main();
