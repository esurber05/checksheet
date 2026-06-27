import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { parseStudentRecord } from "@/lib/schemas/student.ts";
import { parseProgram } from "@/lib/schemas/program.ts";
import { getAllCourses, lookupCourse } from "@/lib/catalog.ts";
import { runAudit } from "@/lib/engine/index.ts";
import type { CourseRow } from "@/app/courses/page";
import { createClient } from "@/lib/supabase/server";
import { getStudentRecordById } from "@/lib/supabase/student";
import PlanView from "@/components/planner/PlanView.tsx";

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

export default async function PlanPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

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
    if (!raw) notFound();
    student = parseStudentRecord(raw);
  }

  const programId = student.programs[0].programId;
  const programRaw = JSON.parse(
    await readFile(
      path.join(process.cwd(), "data", "programs", `${programId}.json`),
      "utf-8",
    ),
  );
  const program = parseProgram(programRaw);

  // Initial audit for the plan sidebar — uses empty courseRecord so sidebar starts at zero
  const emptyStudent = { ...student, courseRecord: [] as typeof student.courseRecord };
  const initialAudit = runAudit(program, emptyStudent);

  // Build course list for the search index
  const rawCourses = getAllCourses();
  const courseRows: CourseRow[] = rawCourses.map((c) => ({
    code: c.code,
    subject: c.subject,
    level: c.level,
    title: c.title,
    credits: c.credits,
    description: c.description,
    pathwaysConcepts: c.pathwaysConcepts,
  }));

  // Title lookup for all courses in the student's record
  const titleMap: Record<string, string> = {};
  for (const entry of student.courseRecord) {
    const code = entry.status === "transfer" ? entry.vtEquivalent : entry.course;
    if (!(code in titleMap)) {
      const found = lookupCourse(code);
      if (found) titleMap[code] = found.title;
    }
  }

  return (
    <PlanView
      student={student}
      program={program}
      courses={courseRows}
      titleMap={titleMap}
      initialGroupResults={initialAudit.groupResults}
    />
  );
}
