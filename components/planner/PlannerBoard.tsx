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
import type { CourseEntry } from "@/lib/schemas/student";

// ── Semester utilities ──────────────────────────────────────────────────────

export function humanizeSemester(s: string): string {
  const [season, year] = s.split("_");
  return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year}`;
}

// Pair semesters sequentially: [0,1], [2,3], … then reverse so newest row is first.
function groupSequential(
  semesters: string[],
): Array<[string, string | undefined]> {
  const pairs: Array<[string, string | undefined]> = [];
  for (let i = 0; i < semesters.length; i += 2) {
    pairs.push([semesters[i], semesters[i + 1]]);
  }
  return pairs.reverse();
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
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`h-full${isOver ? " ring-1 ring-maroon/40 rounded-xl" : ""}`}
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
        <span className="font-mono text-[10px] text-stone-400">{entry.grade}</span>
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
  allSemesters,
}: {
  entry: CourseEntry;
  titleMap: Record<string, string>;
  onRemove?: () => void;
  onMove?: (semester: string) => void;
  allSemesters?: string[];
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
  const moveTargets = allSemesters?.filter((s) => s !== entrySemester) ?? [];

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

function SemesterCard({
  semester,
  courses,
  titleMap,
  allSemesters,
  onAdd,
  onRemove,
  onMove,
  onDelete,
}: {
  semester: string;
  courses: CourseEntry[];
  titleMap: Record<string, string>;
  allSemesters?: string[];
  onAdd: () => void;
  onRemove: (entry: CourseEntry) => void;
  onMove: (entry: CourseEntry, semester: string) => void;
  onDelete: () => void;
}) {
  const total = semesterTotalCredits(courses);
  const creditFlagged = total > 0 && (total < 12 || total > 19);

  return (
    <div className="rounded-xl border border-stone-200 shadow-sm p-5 flex flex-col h-full min-h-[180px] bg-white group/sem">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-sans text-sm font-semibold text-stone-700 tracking-tight">
          {humanizeSemester(semester)}
        </span>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span
              className={`font-mono text-sm tabular-nums shrink-0 ${
                creditFlagged ? "text-burnt" : "text-stone-400"
              }`}
            >
              {total} cr
            </span>
          )}
          <button
            onClick={onDelete}
            className="opacity-0 group-hover/sem:opacity-100 transition-opacity text-stone-300 hover:text-red-400"
            aria-label="Remove semester"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <hr className="border-stone-100 my-3" />
      <div className="flex flex-col flex-1">
        {courses.map((entry, i) => {
          const row = (
            <CourseRowView
              entry={entry}
              titleMap={titleMap}
              onRemove={entry.status === "planned" ? () => onRemove(entry) : undefined}
              onMove={entry.status === "planned" ? (sem) => onMove(entry, sem) : undefined}
              allSemesters={allSemesters}
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
      <button
        onClick={onAdd}
        className="mt-4 w-full text-left text-xs text-maroon/50 border border-dashed border-maroon/25 rounded-lg px-3 py-2 hover:border-maroon/50 hover:text-maroon/80 transition-colors"
      >
        + Add course
      </button>
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
  courses: CourseRow[];
  courseRecord: CourseEntry[];
  mergedTitleMap: Record<string, string>;
  semesterRange: string[];
  onAddCourse: (code: string, credits: number, semester: string, title?: string) => void;
  onRemoveCourse: (entry: CourseEntry) => void;
  onMoveCourse: (entry: CourseEntry, semester: string) => void;
  onRemoveSemester: (semester: string) => void;
};

export default function PlannerBoard({
  courses,
  courseRecord,
  mergedTitleMap,
  semesterRange,
  onAddCourse,
  onRemoveCourse,
  onMoveCourse,
  onRemoveSemester,
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

  // Only show planned courses in the board
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
    const [code, fromSem] = (active.id as string).split("::");
    const entry = courseRecord.find(
      (e) => e.status === "planned" && e.course === code && e.semester === fromSem,
    );
    if (!entry || targetSem === fromSem) return;
    onMoveCourse(entry, targetSem);
  }

  const pairs = groupSequential(semesterRange);

  if (pairs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
        <p className="text-sm text-stone-400">No semesters in this plan.</p>
        <p className="text-xs text-stone-300">Use &ldquo;+ New Semester&rdquo; above to add one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-4">
          {pairs.flatMap(([left, right]) => {
            const items: React.ReactNode[] = [];

            items.push(
              <DroppableSemesterCard key={left} id={left}>
                <SemesterCard
                  semester={left}
                  courses={bySemester.get(left) ?? []}
                  titleMap={mergedTitleMap}
                  allSemesters={semesterRange}
                  onAdd={() => openModal(left)}
                  onRemove={onRemoveCourse}
                  onMove={onMoveCourse}
                  onDelete={() => onRemoveSemester(left)}
                />
              </DroppableSemesterCard>,
            );

            if (right) {
              items.push(
                <DroppableSemesterCard key={right} id={right}>
                  <SemesterCard
                    semester={right}
                    courses={bySemester.get(right) ?? []}
                    titleMap={mergedTitleMap}
                    allSemesters={semesterRange}
                    onAdd={() => openModal(right)}
                    onRemove={onRemoveCourse}
                    onMove={onMoveCourse}
                    onDelete={() => onRemoveSemester(right)}
                  />
                </DroppableSemesterCard>,
              );
            } else {
              items.push(<div key={`empty-${left}`} />);
            }

            return items;
          })}
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
