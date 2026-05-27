import MiniSearch from "minisearch";
import type { CourseRow } from "@/app/courses/page";

interface SearchDoc {
  code: string;
  codeCompressed: string;
  title: string;
  description: string;
  credits: CourseRow["credits"];
  pathwaysConcepts: string[];
}

export interface CourseSearchResult {
  code: string;
  title: string;
  credits: CourseRow["credits"];
  pathwaysConcepts: string[];
  description?: string;
  score: number;
}

export interface SearchOptions {
  subjectFilter?: string;
  pathwayFilter?: string;
  levelFilter?: string;
  limit?: number;
}

let searchIndex: MiniSearch<SearchDoc> | null = null;
let allCourses: CourseRow[] | null = null;

export function initSearch(courses: CourseRow[]): void {
  if (searchIndex) return;
  allCourses = courses;
  searchIndex = new MiniSearch<SearchDoc>({
    idField: "code",
    fields: ["code", "codeCompressed", "title", "description"],
    storeFields: ["code", "title", "credits", "pathwaysConcepts"],
    searchOptions: {
      boost: { code: 5, codeCompressed: 5, title: 2, description: 1 },
      prefix: true,
      fuzzy: 0.2,
    },
  });
  searchIndex.addAll(
    courses.map((c) => ({
      code: c.code,
      codeCompressed: c.code.replace(/\s+/g, ""),
      title: c.title,
      description: c.description ?? "",
      credits: c.credits,
      pathwaysConcepts: c.pathwaysConcepts,
    }))
  );
}

function matchesFilters(
  code: string,
  pathways: string[],
  opts: SearchOptions
): boolean {
  const { subjectFilter, pathwayFilter, levelFilter } = opts;
  if (subjectFilter && subjectFilter !== "All") {
    if (code.split(" ")[0] !== subjectFilter) return false;
  }
  if (pathwayFilter && pathwayFilter !== "All") {
    if (!pathways.includes(pathwayFilter)) return false;
  }
  if (levelFilter && levelFilter !== "All") {
    const num = code.split(" ")[1] ?? "";
    const lvl = parseInt(num[0] ?? "0", 10) * 1000;
    if (lvl !== +levelFilter) return false;
  }
  return true;
}

export function searchCourses(
  query: string,
  options: SearchOptions = {}
): CourseSearchResult[] {
  if (!searchIndex || !allCourses) return [];
  const { limit = 1000 } = options;

  if (!query.trim()) {
    return allCourses
      .filter((c) => matchesFilters(c.code, c.pathwaysConcepts, options))
      .slice(0, limit)
      .map((c) => ({
        code: c.code,
        title: c.title,
        credits: c.credits,
        pathwaysConcepts: c.pathwaysConcepts,
        description: c.description,
        score: 0,
      }));
  }

  const descMap = new Map(allCourses.map((c) => [c.code, c.description]));

  return searchIndex
    .search(query)
    .filter((r) =>
      matchesFilters(r.code as string, r.pathwaysConcepts as string[], options)
    )
    .slice(0, limit)
    .map((r) => ({
      code: r.code as string,
      title: r.title as string,
      credits: r.credits as CourseRow["credits"],
      pathwaysConcepts: r.pathwaysConcepts as string[],
      description: descMap.get(r.code as string),
      score: r.score,
    }));
}
