import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { parseStudentRecord, totalEffectiveCredits } from "@/lib/schemas/student.ts";
import { parseProgram } from "@/lib/schemas/program.ts";
import { getAllCourses, lookupCourse } from "@/lib/catalog.ts";
import type { CourseRow } from "@/app/courses/page";
import PlannerBoard from "@/components/planner/PlannerBoard";

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

function humanizeSemester(s: string): string {
  const [season, year] = s.split("_");
  return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year}`;
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

  // Build catalog course list for the search index (passed to client component)
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

  // Build title lookup for all courses in the student's record
  const titleMap: Record<string, string> = {};
  for (const entry of student.courseRecord) {
    const code = entry.status === "transfer" ? entry.vtEquivalent : entry.course;
    if (!(code in titleMap)) {
      const found = lookupCourse(code);
      if (found) titleMap[code] = found.title;
    }
  }

  // Collect transfers without a semester (shown in "Prior Credit" section)
  const noSemesterTransfers = student.courseRecord.filter(
    (e) => e.status === "transfer" && !e.semester,
  );

  const totalCredits = totalEffectiveCredits(student);
  const gradDisplay = student.expectedGraduation
    ? humanizeSemester(student.expectedGraduation)
    : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">
          {student.displayName}
        </h1>
        <p className="mt-2 text-stone-600">
          {program.programName}
          <span className="mx-2 text-stone-300">·</span>
          {program.catalogYear}
        </p>
        <p className="mt-1 text-sm text-stone-500">
          {totalCredits} credits earned
          {gradDisplay && <> · Expected graduation {gradDisplay}</>}
        </p>
      </div>

      {/* Interactive grid (client component) */}
      <PlannerBoard
        student={student}
        courses={courseRows}
        currentSemOverride={currentSemOverride}
        titleMap={titleMap}
        noSemesterTransfers={noSemesterTransfers}
      />
    </div>
  );
}
