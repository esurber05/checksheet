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
  const studentRaw = await loadStudentById(studentId);
  if (!studentRaw) return [];

  const student = parseStudentRecord({ ...studentRaw, courseRecord });

  const programId = student.programs[0].programId;
  const programRaw = JSON.parse(
    await readFile(
      path.join(process.cwd(), "data", "programs", `${programId}.json`),
      "utf-8",
    ),
  );
  const program = parseProgram(programRaw);

  const result = runAudit(program, student);
  return result.groupResults;
}
