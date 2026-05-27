"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { initSearch, searchCourses } from "@/lib/catalog-search";
import type { CourseRow } from "@/app/courses/page";

const PAGE_SIZE = 25;
const LEVELS = ["1000", "2000", "3000", "4000", "5000"];

interface Props {
  courses: CourseRow[];
  subjects: string[];
  pathwayConcepts: string[];
}

export default function CourseSearch({ courses, subjects, pathwayConcepts }: Props) {
  // Initialize MiniSearch index once — no-op on subsequent renders
  initSearch(courses);

  const router = useRouter();
  const params = useSearchParams();

  const subject = params.get("subject") ?? "All";
  const pathway = params.get("pathway") ?? "All";
  const level = params.get("level") ?? "All";
  const pageParam = params.get("page") ?? "1";

  // inputValue drives visible input + live search immediately
  // URL q param is debounced separately
  const [inputValue, setInputValue] = useState(() => params.get("q") ?? "");

  // Debounce URL sync for query — 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (inputValue) {
        next.set("q", inputValue);
      } else {
        next.delete("q");
      }
      next.delete("page");
      router.replace(next.toString() ? `?${next.toString()}` : "/courses", {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "" || value === "All") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete("page");
    // Keep q in sync with current inputValue
    if (inputValue) {
      next.set("q", inputValue);
    } else {
      next.delete("q");
    }
    router.replace(next.toString() ? `?${next.toString()}` : "/courses", {
      scroll: false,
    });
  }

  function setPage(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p === 1) {
      next.delete("page");
    } else {
      next.set("page", String(p));
    }
    router.replace(`?${next.toString()}`, { scroll: false });
  }

  const results = useMemo(
    () =>
      searchCourses(inputValue, {
        subjectFilter: subject,
        pathwayFilter: pathway,
        levelFilter: level,
      }),
    [inputValue, subject, pathway, level]
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(pageParam, 10) || 1, 1), totalPages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isFiltered =
    inputValue !== "" ||
    subject !== "All" ||
    pathway !== "All" ||
    level !== "All";

  function clearFilters() {
    setInputValue("");
    router.replace("/courses", { scroll: false });
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-8">
        Course Catalog
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
        <Input
          className="pl-9"
          placeholder="Search courses…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          active={subject !== "All"}
          value={subject}
          onChange={(e) => setFilter("subject", e.target.value)}
          aria-label="Filter by subject"
        >
          <option value="All">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>

        <Select
          active={pathway !== "All"}
          value={pathway}
          onChange={(e) => setFilter("pathway", e.target.value)}
          aria-label="Filter by pathway concept"
        >
          <option value="All">All Pathway Concepts</option>
          {pathwayConcepts.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>

        <Select
          active={level !== "All"}
          value={level}
          onChange={(e) => setFilter("level", e.target.value)}
          aria-label="Filter by level"
        >
          <option value="All">All Levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}-level
            </option>
          ))}
        </Select>
      </div>

      {/* Result count */}
      <p className="text-sm text-stone-600 mb-4">
        {isFiltered ? (
          <>
            <span className="font-medium text-stone-900">
              {results.length.toLocaleString()}
            </span>{" "}
            of {courses.length.toLocaleString()} courses
          </>
        ) : (
          <>
            <span className="font-medium text-stone-900">
              {courses.length.toLocaleString()}
            </span>{" "}
            courses
          </>
        )}
      </p>

      {/* Results */}
      {pageItems.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-stone-600 mb-4">No courses match your search.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ul>
          {pageItems.map((course) => (
            <li key={course.code} className="border-b border-stone-200 hover:bg-stone-50 -mx-1">
              <Link
                href={`/courses/${encodeURIComponent(course.code)}`}
                className="block py-3 px-1"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="font-mono text-sm text-stone-600 shrink-0">
                      {course.code}
                    </span>
                    <span className="font-sans font-medium text-stone-900 truncate">
                      {course.title}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums text-sm text-stone-500 shrink-0">
                    {creditLabel(course.credits)}
                  </span>
                </div>
                {course.description && (
                  <p className="text-sm text-stone-600 mt-0.5 leading-snug">
                    {truncate(course.description, 120)}
                  </p>
                )}
                {course.pathwaysConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {course.pathwaysConcepts.map((id) => (
                      <span
                        key={id}
                        className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-stone-200">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-stone-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function creditLabel(credits: { min: number; max: number }): string {
  return credits.min === credits.max
    ? `${credits.min} cr`
    : `${credits.min}–${credits.max} cr`;
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max).trimEnd() + "…";
}
