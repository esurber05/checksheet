"use client";

import { useState, useRef, useEffect } from "react";
import type { StudentRecord, CourseEntry } from "@/lib/schemas/student.ts";
import type { Program } from "@/lib/schemas/program.ts";
import type { GroupResult } from "@/lib/engine/index.ts";
import type { CourseRow } from "@/app/courses/page";
import RequirementsPanel from "./RequirementsPanel.tsx";
import PlannerBoard, { humanizeSemester } from "./PlannerBoard.tsx";

// ── Semester range utilities ────────────────────────────────────────────────

// Cycles fall ↔ spring only (no summer/winter). Used for the default 8-semester range.
function nextFallSpring(s: string): string {
  const [season, year] = s.split("_");
  const y = parseInt(year, 10);
  return season === "fall" ? `spring_${y + 1}` : `fall_${y}`;
}

// Cycles all 4 seasons. Used for the "New Semester" picker options.
function nextAllSeason(s: string): string {
  const [season, year] = s.split("_");
  const y = parseInt(year, 10);
  switch (season) {
    case "spring": return `summer_${y}`;
    case "summer": return `fall_${y}`;
    case "fall":   return `winter_${y}`;
    case "winter": return `spring_${y + 1}`;
    default:       return `fall_${y + 1}`;
  }
}

function buildInitialRange(enrolledSemester: string): string[] {
  let start = enrolledSemester;
  while (start.startsWith("summer") || start.startsWith("winter")) {
    start = nextFallSpring(start);
  }
  const range: string[] = [];
  let cur = start;
  for (let i = 0; i < 8; i++) {
    range.push(cur);
    cur = nextFallSpring(cur);
  }
  return range;
}

// Returns the next 4 possible semesters after `last` in full-season order.
function nextSemesterOptions(last: string): string[] {
  const opts: string[] = [];
  let cur = nextAllSeason(last);
  for (let i = 0; i < 4; i++) {
    opts.push(cur);
    cur = nextAllSeason(cur);
  }
  return opts;
}

// ── Component ───────────────────────────────────────────────────────────────

type Props = {
  student: StudentRecord;
  program: Program;
  courses: CourseRow[];
  titleMap: Record<string, string>;
  initialGroupResults: GroupResult[];
};

export default function PlanView({
  student,
  program,
  courses,
  titleMap,
  initialGroupResults,
}: Props) {
  const [courseRecord, setCourseRecord] = useState<CourseEntry[]>([]);
  const [clientTitles, setClientTitles] = useState<Record<string, string>>({});
  const [semesterRange, setSemesterRange] = useState<string[]>(
    () => buildInitialRange(student.enrolledSemester),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const mergedTitleMap = { ...titleMap, ...clientTitles };

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen]);

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

  function addSemester(sem: string) {
    setSemesterRange((prev) => [...prev, sem]);
    setPickerOpen(false);
  }

  function removeSemester(sem: string) {
    setSemesterRange((prev) => prev.filter((s) => s !== sem));
    setCourseRecord((prev) =>
      prev.filter((e) => !("semester" in e && e.semester === sem)),
    );
  }

  const last = semesterRange[semesterRange.length - 1];
  const pickerOptions = last ? nextSemesterOptions(last) : [];

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
        {/* Top bar */}
        <header className="shrink-0 px-8 py-4 bg-white border-b border-stone-200 flex items-center justify-end">
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
            >
              + New Semester
            </button>
            {pickerOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                {pickerOptions.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => addSemester(sem)}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    {humanizeSemester(sem)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable grid area */}
        <div className="flex-1 overflow-auto p-6">
          <PlannerBoard
            courses={courses}
            courseRecord={courseRecord}
            mergedTitleMap={mergedTitleMap}
            semesterRange={semesterRange}
            onAddCourse={addCourse}
            onRemoveCourse={removeCourse}
            onMoveCourse={moveCourse}
            onRemoveSemester={removeSemester}
          />
        </div>
      </div>
    </div>
  );
}
