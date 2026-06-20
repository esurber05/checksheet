"use client";

import { useState } from "react";
import type { StudentRecord, CourseEntry } from "@/lib/schemas/student.ts";
import type { Program } from "@/lib/schemas/program.ts";
import type { GroupResult } from "@/lib/engine/index.ts";
import type { CourseRow } from "@/app/courses/page";
import RequirementsPanel from "./RequirementsPanel.tsx";
import PlannerBoard from "./PlannerBoard.tsx";

type Props = {
  student: StudentRecord;
  program: Program;
  courses: CourseRow[];
  currentSemOverride?: string;
  titleMap: Record<string, string>;
  initialGroupResults: GroupResult[];
};

export default function PlanView({
  student,
  program,
  courses,
  currentSemOverride,
  titleMap,
  initialGroupResults,
}: Props) {
  const [courseRecord, setCourseRecord] = useState<CourseEntry[]>([]);
  const [clientTitles, setClientTitles] = useState<Record<string, string>>({});

  const mergedTitleMap = { ...titleMap, ...clientTitles };

  function addCourse(code: string, credits: number, semester: string, title?: string) {
    const entry: CourseEntry = { status: "planned", course: code, credits, semester };
    setCourseRecord((prev) => [...prev, entry]);
    if (title) setClientTitles((prev) => ({ ...prev, [code]: title }));
  }

  function removeCourse(entry: CourseEntry) {
    setCourseRecord((prev) => prev.filter((e) => e !== entry));
  }

  function moveCourse(entry: CourseEntry, targetSemester: string) {
    setCourseRecord((prev) =>
      prev.map((e) => (e !== entry ? e : { ...e, semester: targetSemester })),
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Requirements sidebar */}
      <RequirementsPanel
        studentId={student.studentId}
        programId={program.programId}
        initialGroupResults={initialGroupResults}
        courseRecord={courseRecord}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Slim top bar — just the action button */}
        <header className="shrink-0 px-8 py-4 bg-white border-b border-stone-200 flex items-center justify-end">
          <button
            disabled
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-400 cursor-not-allowed select-none"
            title="Multi-plan support coming soon"
          >
            + New Semester
          </button>
        </header>

        {/* Scrollable grid area */}
        <div className="flex-1 overflow-auto p-6">
          <PlannerBoard
            student={student}
            courses={courses}
            courseRecord={courseRecord}
            mergedTitleMap={mergedTitleMap}
            currentSemOverride={currentSemOverride}
            onAddCourse={addCourse}
            onRemoveCourse={removeCourse}
            onMoveCourse={moveCourse}
          />
        </div>
      </div>
    </div>
  );
}
