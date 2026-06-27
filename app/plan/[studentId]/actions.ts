"use server";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseStudentRecord } from "@/lib/schemas/student.ts";
import { parseProgram } from "@/lib/schemas/program.ts";
import { runAudit } from "@/lib/engine/index.ts";
import type { CourseEntry } from "@/lib/schemas/student.ts";
import type { GroupResult } from "@/lib/engine/index.ts";
import { createClient } from "@/lib/supabase/server";
import { getStudentRecordById } from "@/lib/supabase/student";

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
    // Try Supabase first (real user), fall back to JSON sample data
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let student;
    if (user) {
      const fromDb = await getStudentRecordById(supabase, studentId, user.id);
      if (fromDb) student = fromDb;
    }

    if (!student) {
      const raw = await loadStudentById(studentId);
      if (!raw) return [];
      student = parseStudentRecord(raw);
    }

    // Convert planned courses to in_progress so the audit engine counts them.
    // Filter out 0-credit entries (variable-credit guard). Construct the shape
    // explicitly so TypeScript knows the result is InProgressCourse[].
    const planAsInProgress = courseRecord
      .filter((e): e is Extract<typeof e, { status: "planned" }> =>
        e.status === "planned" && e.credits > 0
      )
      .map((e) => ({
        status: "in_progress" as const,
        course: e.course,
        credits: e.credits,
        semester: e.semester,
      }));

    const studentWithPlan = { ...student, courseRecord: planAsInProgress };

    const programId = studentWithPlan.programs[0].programId;
    const programRaw = JSON.parse(
      await readFile(
        path.join(process.cwd(), "data", "programs", `${programId}.json`),
        "utf-8",
      ),
    );
    const program = parseProgram(programRaw);

    return runAudit(program, studentWithPlan).groupResults;
  } catch (err) {
    console.error("[recomputeAudit]", err);
    return [];
  }
}
