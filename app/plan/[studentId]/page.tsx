import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { parseStudentRecord } from "@/lib/schemas/student.ts";
import { parseProgram } from "@/lib/schemas/program.ts";
import { getAllCourses, lookupCourse } from "@/lib/catalog.ts";
import { runAudit } from "@/lib/engine/index.ts";
import type { CourseRow } from "@/app/courses/page";
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

  const studentRaw = await loadStudentById(studentId);
  if (!studentRaw) notFound();

  const rawWithOverride = studentRaw as { currentSemester?: string };
  const currentSemOverride = rawWithOverride.currentSemester;

  const student = parseStudentRecord(studentRaw);

  const programId = student.programs[0].programId;
  const programRaw = JSON.parse(
    await readFile(
      path.join(process.cwd(), "data", "programs", `${programId}.json`),
      "utf-8",
    ),
  );
  const program = parseProgram(programRaw);

  // Initial audit for the requirements sidebar
  const initialAudit = runAudit(program, student);

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
      currentSemOverride={currentSemOverride}
      titleMap={titleMap}
      initialGroupResults={initialAudit.groupResults}
    />
  );
}
