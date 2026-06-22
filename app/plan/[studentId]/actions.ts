"use server";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseStudentRecord } from "@/lib/schemas/student.ts";
import { parseProgram } from "@/lib/schemas/program.ts";
import { runAudit } from "@/lib/engine/index.ts";
import type { CourseEntry } from "@/lib/schemas/student.ts";
import type { GroupResult } from "@/lib/engine/index.ts";

async function loadStudentById(studentId: string) {
  const dir = path.join(process.cwd(), "data", "students");
  const files = await readdir(dir);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await readFile(path.join(dir, file), "utf-8");
    const parsed = JSON.parse(raw) as { studentId?: string };
    if (parsed.studentId === studentId) return parsed;
  }
  return null;
}

export async function recomputeAudit(
  studentId: string,
  courseRecord: CourseEntry[],
): Promise<GroupResult[]> {
  try {
    const studentRaw = await loadStudentById(studentId);
    if (!studentRaw) return [];

    // Convert planned courses to in_progress so the audit engine counts them.
    // Filter out 0-credit entries (variable-credit guard).
    const planAsInProgress = courseRecord
      .filter((e) => e.status === "planned" && e.credits > 0)
      .map((e) => ({ ...e, status: "in_progress" as const }));

    const student = parseStudentRecord({ ...studentRaw, courseRecord: planAsInProgress });

    const programId = student.programs[0].programId;
    const programRaw = JSON.parse(
      await readFile(
        path.join(process.cwd(), "data", "programs", `${programId}.json`),
        "utf-8",
      ),
    );
    const program = parseProgram(programRaw);

    return runAudit(program, student).groupResults;
  } catch (err) {
    console.error("[recomputeAudit]", err);
    return [];
  }
}
