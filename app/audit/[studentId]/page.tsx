import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { parseProgram } from "@/lib/schemas/program.ts";
import { parseStudentRecord, effectiveCourses } from "@/lib/schemas/student.ts";
import { runAudit } from "@/lib/engine/index.ts";
import { lookupCourse } from "@/lib/catalog.ts";
import ProgressPanel from "@/components/audit/ProgressPanel.tsx";
import RequirementGroup from "@/components/audit/RequirementGroup.tsx";

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

export default async function AuditPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  // Scan data/students/ for a file whose studentId matches the URL param.
  const studentRaw = await loadStudentById(studentId);
  if (!studentRaw) notFound();
  const student = parseStudentRecord(studentRaw);

  // Load and parse program (first enrolled).
  const programId = student.programs[0].programId;
  const programRaw = JSON.parse(
    await readFile(
      path.join(process.cwd(), "data", "programs", `${programId}.json`),
      "utf-8",
    ),
  );
  const program = parseProgram(programRaw);

  const audit = runAudit(program, student);

  // Re-sort each group's requirementResults to match the JSON definition order.
  // The dispatcher processes requirements by evaluation tier for correctness but
  // stores results in that tier order; we restore the human-readable JSON order here.
  for (const group of program.requirementGroups) {
    const groupResult = audit.groupResults.find((g) => g.groupId === group.id);
    if (!groupResult) continue;
    const order = new Map(group.requirements.map((req, i) => [req.id, i]));
    groupResult.requirementResults.sort(
      (a, b) => (order.get(a.requirementId) ?? 999) - (order.get(b.requirementId) ?? 999),
    );
  }

  // Build catalog title lookup for all matched courses so RequirementRow can
  // display a human-readable course title instead of the raw requirement ID.
  const courseTitles: Record<string, string> = {};
  for (const group of audit.groupResults) {
    for (const result of group.requirementResults) {
      for (const code of result.coursesMatched) {
        if (!(code in courseTitles)) {
          const entry = lookupCourse(code);
          if (entry) courseTitles[code] = entry.title;
        }
      }
    }
  }

  // Compute unallocated courses — AuditResult has no unusedCourses field,
  // so we derive it by diffing effectiveCourses against all coursesMatched.
  const allMatchedCodes = new Set(
    audit.groupResults
      .flatMap((g) => g.requirementResults)
      .flatMap((r) => r.coursesMatched),
  );
  const unallocated = effectiveCourses(student)
    .map((c) => c.course)
    .filter((code) => !allMatchedCodes.has(code));

  // Format expected graduation for display.
  const gradDisplay = student.expectedGraduation
    ? student.expectedGraduation.replace("_", " ")
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
          {gradDisplay && (
            <>
              <span className="mx-2 text-stone-300">·</span>
              Expected {gradDisplay}
            </>
          )}
        </p>
      </div>

      {/* Progress + GPA panel */}
      <ProgressPanel audit={audit} />

      {/* Requirement groups */}
      {audit.groupResults.map((group) => (
        <RequirementGroup key={group.groupId} group={group} courseTitles={courseTitles} />
      ))}

      {/* Unallocated courses footnote */}
      {unallocated.length > 0 && (
        <div className="pt-4 border-t border-stone-200">
          <p className="text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">
            Unallocated courses
          </p>
          <p className="font-mono text-sm text-stone-500">
            {unallocated.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
