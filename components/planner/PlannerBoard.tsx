"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { initSearch, searchCourses } from "@/lib/catalog-search";
import type { CourseSearchResult } from "@/lib/catalog-search";
import type { CourseRow } from "@/app/courses/page";
import type { CourseEntry, StudentRecord } from "@/lib/schemas/student";

// ── Semester utilities ──────────────────────────────────────────────────────

function semesterOrd(s: string): number {
  const [season, year] = s.split("_");
  const y = parseInt(year, 10);
  return season === "spring" ? y * 2 : y * 2 + 1;
}

function nextSemester(s: string): string {
  const [season, year] = s.split("_");
  const y = parseInt(year, 10);
  return season === "fall" ? `spring_${y + 1}` : `fall_${y}`;
}

function humanizeSemester(s: string): string {
  const [season, year] = s.split("_");
  return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year}`;
}

function buildSemesterRange(student: StudentRecord, courseRecord: CourseEntry[]): string[] {
  const allSemesters = courseRecord
    .map((c) => ("semester" in c ? c.semester : undefined))
    .filter((s): s is string => !!s);

  let start = student.enrolledSemester;
  if (allSemesters.length > 0) {
    start = [...allSemesters].sort((a, b) => semesterOrd(a) - semesterOrd(b))[0];
  }

  while (start.startsWith("summer") || start.startsWith("winter")) {
    start = nextSemester(start);
  }

  const range: string[] = [];
  let cur = start;
  for (let i = 0; i < 8; i++) {
    range.push(cur);
    cur = nextSemester(cur);
  }

  const maxCourse = allSemesters.reduce(
    (max, s) => (semesterOrd(s) > semesterOrd(max) ? s : max),
    range[range.length - 1],
  );
  while (semesterOrd(maxCourse) > semesterOrd(range[range.length - 1])) {
    range.push(nextSemester(range[range.length - 1]));
  }

  return range;
}

function derivedCurrentSemester(override?: string): string {
  if (override) return override;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  if (month >= 8) return `fall_${year}`;
  if (month <= 4) return `spring_${year}`;
  return `fall_${year}`;
}

// ── Two-column grid grouping ────────────────────────────────────────────────

type YearPair = { year: number; spring?: string; fall?: string };

function groupByYear(semesters: string[]): YearPair[] {
  const map = new Map<number, YearPair>();
  for (const sem of semesters) {
    const [season, yr] = sem.split("_");
    if (season !== "spring" && season !== "fall") continue;
    const y = parseInt(yr, 10);
    if (!map.has(y)) map.set(y, { year: y });
    if (season === "spring") map.get(y)!.spring = sem;
    else map.get(y)!.fall = sem;
  }
  return [...map.values()].sort((a, b) => b.year - a.year);
}

// ── Course helpers ──────────────────────────────────────────────────────────

function courseCredits(entry: CourseEntry): number {
  if (entry.status === "withdrawn") return 0;
  return entry.credits;
}

function semesterTotalCredits(courses: CourseEntry[]): number {
  return courses.reduce((sum, c) => sum + courseCredits(c), 0);
}

function findInRecord(
  courseRecord: CourseEntry[],
  code: string,
): { found: boolean; where?: string } {
  for (const entry of courseRecord) {
    const match =
      entry.status === "transfer"
        ? entry.vtEquivalent === code
        : entry.course === code;
    if (match) {
      const sem = "semester" in entry && entry.semester ? entry.semester : undefined;
      return { found: true, where: sem ? humanizeSemester(sem) : "your record" };
    }
  }
  return { found: false };
}

// ── Drag-and-drop wrappers ──────────────────────────────────────────────────

function DraggableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-30 cursor-grabbing" : "cursor-grab"}
    >
      {children}
    </div>
  );
}

function DroppableSemesterCard({
  id,
  active,
  children,
}: {
  id: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !active });
  return (
    <div
      ref={setNodeRef}
      className={`h-full${isOver && active ? " ring-1 ring-maroon/40 rounded-xl" : ""}`}
    >
      {children}
    </div>
  );
}

// ── Status pill ─────────────────────────────────────────────────────────────

function StatusPill({ entry }: { entry: CourseEntry }) {
  const base = "px-1.5 py-0.5 rounded-md text-[10px] font-medium shrink-0";
  if (entry.status === "completed") {
    return (
      <span className="flex items-center gap-1 shrink-0">
        <span className="text-green-700 text-xs leading-none">✓</span>
        <span className={`font-mono text-[10px] text-stone-400`}>{entry.grade}</span>
      </span>
    );
  }
  if (entry.status === "in_progress") {
    return <span className={`${base} bg-maroon/10 text-maroon`}>IP</span>;
  }
  if (entry.status === "planned") {
    return <span className={`${base} bg-stone-100 text-stone-400`}>planned</span>;
  }
  if (entry.status === "transfer") {
    const label =
      entry.source === "ap" ? "AP" : entry.source === "ib" ? "IB" : "Transfer";
    return <span className={`${base} bg-stone-100 text-stone-500`}>{label}</span>;
  }
  return <span className={`${base} bg-stone-100 text-stone-300`}>W</span>;
}

// ── Course row ──────────────────────────────────────────────────────────────

function CourseRowView({
  entry,
  titleMap,
  onRemove,
  onMove,
  futureSemesters,
}: {
  entry: CourseEntry;
  titleMap: Record<string, string>;
  onRemove?: () => void;
  onMove?: (semester: string) => void;
  futureSemesters?: string[];
}) {
  const isWithdrawn = entry.status === "withdrawn";
  const isPlanned = entry.status === "planned";
  const isTransfer = entry.status === "transfer";

  const lookupCode = isTransfer ? entry.vtEquivalent : entry.course;
  const title = titleMap[lookupCode];
  const credits = isWithdrawn ? null : entry.credits;

  const codeClass = [
    "font-mono text-xs shrink-0",
    isWithdrawn
      ? "text-stone-300 line-through"
      : isPlanned
        ? "text-stone-400"
        : "text-stone-800",
  ].join(" ");

  const titleClass = [
    "text-xs flex-1 min-w-0 truncate",
    isWithdrawn
      ? "text-stone-300 line-through"
      : isPlanned
        ? "text-stone-400"
        : "text-stone-500",
  ].join(" ");

  const entrySemester = "semester" in entry ? entry.semester : undefined;
  const moveTargets = futureSemesters?.filter((s) => s !== entrySemester) ?? [];

  return (
    <div className="flex items-center gap-1.5 py-1 group">
      <span className={codeClass}>{entry.course}</span>
      {title && <span className={titleClass}>{title}</span>}
      {credits != null && (
        <span className="font-mono text-[11px] tabular-nums text-stone-400 shrink-0">
          {credits}
        </span>
      )}
      <StatusPill entry={entry} />

      {onRemove && (
        <button
          onClick={onRemove}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 text-stone-300 hover:text-stone-500 shrink-0"
          aria-label="Remove"
        >
          <X size={11} />
        </button>
      )}

      {onMove && moveTargets.length > 0 && (
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onMove(e.target.value);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-stone-400 border-0 bg-transparent cursor-pointer focus:outline-none shrink-0"
          aria-label="Move to semester"
        >
          <option value="" disabled>Move…</option>
          {moveTargets.map((s) => (
            <option key={s} value={s}>
              {humanizeSemester(s)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

// ── Semester card ───────────────────────────────────────────────────────────

type SemesterPhase = "past" | "current" | "future";

function SemesterCard({
  semester,
  courses,
  phase,
  titleMap,
  futureSemesters,
  onAdd,
  onRemove,
  onMove,
}: {
  semester: string;
  courses: CourseEntry[];
  phase: SemesterPhase;
  titleMap: Record<string, string>;
  futureSemesters?: string[];
  onAdd?: () => void;
  onRemove?: (entry: CourseEntry) => void;
  onMove?: (entry: CourseEntry, semester: string) => void;
}) {
  const total = semesterTotalCredits(courses);
  const creditFlagged = total > 0 && (total < 12 || total > 19);

  const cardClass = [
    "rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col h-full min-h-[180px]",
    phase === "past" ? "bg-stone-50/60" : "bg-white",
    phase === "current" ? "border-t-2 border-t-maroon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass}>
      <div className="flex items-baseline justify-between mb-0.5">
        <span className="font-serif text-base font-semibold text-stone-800 tracking-tight">
          {humanizeSemester(semester)}
        </span>
        {total > 0 && (
          <span
            className={`font-mono text-sm tabular-nums shrink-0 ${
              creditFlagged ? "text-burnt" : "text-stone-400"
            }`}
          >
            {total} cr
          </span>
        )}
      </div>
      <hr className="border-stone-100 my-3" />
      <div className="flex flex-col flex-1">
        {courses.map((entry, i) => {
          const row = (
            <CourseRowView
              entry={entry}
              titleMap={titleMap}
              onRemove={entry.status === "planned" ? () => onRemove?.(entry) : undefined}
              onMove={
                entry.status === "planned" ? (sem) => onMove?.(entry, sem) : undefined
              }
              futureSemesters={futureSemesters}
            />
          );
          if (entry.status === "planned") {
            return (
              <DraggableRow key={i} id={`${entry.course}::${entry.semester}`}>
                {row}
              </DraggableRow>
            );
          }
          return <div key={i}>{row}</div>;
        })}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-4 w-full text-left text-xs text-maroon/50 border border-dashed border-maroon/25 rounded-lg px-3 py-2 hover:border-maroon/50 hover:text-maroon/80 transition-colors"
        >
          + Add course
        </button>
      )}
    </div>
  );
}

// ── Modal result row ────────────────────────────────────────────────────────

function ModalResultRow({
  result,
  duplicate,
  onAdd,
}: {
  result: CourseSearchResult;
  duplicate?: string;
  onAdd: () => void;
}) {
  const creditsLabel =
    result.credits.min === result.credits.max
      ? String(result.credits.min)
      : `${result.credits.min}–${result.credits.max}`;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-stone-50">
      <span className="font-mono text-xs text-stone-900 shrink-0 w-20">{result.code}</span>
      <span className="text-xs text-stone-600 flex-1 min-w-0 truncate">{result.title}</span>
      <span className="font-mono text-xs text-stone-400 shrink-0">{creditsLabel}</span>
      {duplicate ? (
        <span className="text-[10px] text-stone-400 italic shrink-0 whitespace-nowrap">
          {duplicate}
        </span>
      ) : (
        <button
          onClick={onAdd}
          className="text-[11px] font-medium text-maroon hover:text-maroon-hover shrink-0"
        >
          Add
        </button>
      )}
    </div>
  );
}

// ── Board ───────────────────────────────────────────────────────────────────

type Props = {
  student: StudentRecord;
  courses: CourseRow[];
  courseRecord: CourseEntry[];
  mergedTitleMap: Record<string, string>;
  currentSemOverride?: string;
  onAddCourse: (code: string, credits: number, semester: string, title?: string) => void;
  onRemoveCourse: (entry: CourseEntry) => void;
  onMoveCourse: (entry: CourseEntry, semester: string) => void;
};

export default function PlannerBoard({
  student,
  courses,
  courseRecord,
  mergedTitleMap,
  currentSemOverride,
  onAddCourse,
  onRemoveCourse,
  onMoveCourse,
}: Props) {
  const [modalSemester, setModalSemester] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CourseSearchResult[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => {
    initSearch(courses);
  }, [courses]);

  useEffect(() => {
    if (!modalSemester) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalSemester(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalSemester]);

  function openModal(sem: string) {
    setQuery("");
    setResults(searchCourses("", { limit: 20 }));
    setModalSemester(sem);
  }

  function handleSearch(value: string) {
    setQuery(value);
    setResults(searchCourses(value, { limit: 20 }));
  }

  const currentSemester = derivedCurrentSemester(currentSemOverride);
  const currentOrd = semesterOrd(currentSemester);

  const semesterRange = buildSemesterRange(student, courseRecord);

  // Always ensure at least 8 semesters of planning space from the current semester
  const minFutureSemesters = 8;
  let futureSemCount = semesterRange.filter((s) => semesterOrd(s) >= currentOrd).length;
  while (futureSemCount < minFutureSemesters) {
    semesterRange.push(nextSemester(semesterRange[semesterRange.length - 1]));
    futureSemCount++;
  }

  const editableSemesters = semesterRange.filter((s) => semesterOrd(s) >= currentOrd);

  // Only show planned courses in the board; historical entries stay in courseRecord for audit
  const bySemester = new Map<string, CourseEntry[]>();
  for (const sem of semesterRange) bySemester.set(sem, []);
  for (const entry of courseRecord) {
    if (entry.status !== "planned") continue;
    const sem = "semester" in entry ? entry.semester : undefined;
    if (!sem) continue;
    if (!bySemester.has(sem)) bySemester.set(sem, []);
    bySemester.get(sem)!.push(entry);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;
    const targetSem = over.id as string;
    if (semesterOrd(targetSem) < currentOrd) return;
    const [code, fromSem] = (active.id as string).split("::");
    const entry = courseRecord.find(
      (e) => e.status === "planned" && e.course === code && e.semester === fromSem,
    );
    if (!entry || targetSem === fromSem) return;
    onMoveCourse(entry, targetSem);
  }

  const yearPairs = groupByYear(semesterRange);

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Two-column spring/fall grid, newest year at top */}
        <div className="space-y-4">
          {/* Column labels */}
          <div className="grid grid-cols-2 gap-4">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-1">Spring</p>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-1">Fall</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {yearPairs.flatMap(({ spring, fall }) => {
              const items: React.ReactNode[] = [];

              // Spring slot
              if (spring) {
                const ord = semesterOrd(spring);
                const phase: SemesterPhase =
                  ord < currentOrd ? "past" : ord === currentOrd ? "current" : "future";
                const isEditable = ord >= currentOrd;
                items.push(
                  <DroppableSemesterCard key={spring} id={spring} active={isEditable}>
                    <SemesterCard
                      semester={spring}
                      courses={bySemester.get(spring) ?? []}
                      phase={phase}
                      titleMap={mergedTitleMap}
                      futureSemesters={editableSemesters}
                      onAdd={isEditable ? () => openModal(spring) : undefined}
                      onRemove={onRemoveCourse}
                      onMove={onMoveCourse}
                    />
                  </DroppableSemesterCard>,
                );
              } else {
                items.push(
                  <div
                    key={`empty-spring-${fall}`}
                    className="rounded-xl border border-dashed border-stone-100 h-full"
                  />,
                );
              }

              // Fall slot
              if (fall) {
                const ord = semesterOrd(fall);
                const phase: SemesterPhase =
                  ord < currentOrd ? "past" : ord === currentOrd ? "current" : "future";
                const isEditable = ord >= currentOrd;
                items.push(
                  <DroppableSemesterCard key={fall} id={fall} active={isEditable}>
                    <SemesterCard
                      semester={fall}
                      courses={bySemester.get(fall) ?? []}
                      phase={phase}
                      titleMap={mergedTitleMap}
                      futureSemesters={editableSemesters}
                      onAdd={isEditable ? () => openModal(fall) : undefined}
                      onRemove={onRemoveCourse}
                      onMove={onMoveCourse}
                    />
                  </DroppableSemesterCard>,
                );
              } else {
                items.push(
                  <div
                    key={`empty-fall-${spring}`}
                    className="rounded-xl border border-dashed border-stone-100 h-full"
                  />,
                );
              }

              return items;
            })}
          </div>
        </div>

        <DragOverlay>
          {activeDragId &&
            (() => {
              const [code, fromSem] = activeDragId.split("::");
              const entry = courseRecord.find(
                (e) => e.status === "planned" && e.course === code && e.semester === fromSem,
              );
              if (!entry) return null;
              const title = mergedTitleMap[entry.course];
              return (
                <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs pointer-events-none">
                  <span className="font-mono text-stone-900 shrink-0">{entry.course}</span>
                  {title && (
                    <span className="text-stone-500 truncate max-w-[140px]">{title}</span>
                  )}
                  {"credits" in entry && (
                    <span className="font-mono tabular-nums text-stone-400 shrink-0">
                      {entry.credits} cr
                    </span>
                  )}
                </div>
              );
            })()}
        </DragOverlay>
      </DndContext>

      {/* Add-course modal */}
      {modalSemester && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40"
          onClick={() => setModalSemester(null)}
        >
          <div
            className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-lg w-full p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-stone-900">
                Add course to {humanizeSemester(modalSemester)}
              </h2>
              <button
                onClick={() => setModalSemester(null)}
                className="text-stone-400 hover:text-stone-700 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <input
              autoFocus
              type="text"
              placeholder="Search by code or title…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-maroon"
            />

            <div className="max-h-72 overflow-y-auto flex flex-col">
              {results.length === 0 ? (
                <p className="text-xs text-stone-400 px-2 py-2">No courses found.</p>
              ) : (
                results.map((r) => {
                  const dup = findInRecord(courseRecord, r.code);
                  return (
                    <ModalResultRow
                      key={r.code}
                      result={r}
                      duplicate={
                        dup.found
                          ? `Already in your plan${dup.where ? ` — ${dup.where}` : ""}`
                          : undefined
                      }
                      onAdd={() =>
                        onAddCourse(r.code, Math.max(1, r.credits.min), modalSemester, r.title)
                      }
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
