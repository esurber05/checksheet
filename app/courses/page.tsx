import { Suspense } from "react";
import { getAllCourses } from "@/lib/catalog";
import CourseSearch from "@/components/courses/CourseSearch";

export type CourseRow = {
  code: string;
  subject: string;
  level: number;
  title: string;
  credits: { min: number; max: number };
  description?: string;
  pathwaysConcepts: string[];
};

function naturalConceptSort(a: string, b: string): number {
  const parse = (s: string) => {
    const m = s.match(/^(\d+)([A-Za-z]*)$/);
    return m ? ([+m[1], m[2]] as [number, string]) : ([0, s] as [number, string]);
  };
  const [aN, aS] = parse(a);
  const [bN, bS] = parse(b);
  return aN !== bN ? aN - bN : aS.localeCompare(bS);
}

export default function CoursesPage() {
  const courses = getAllCourses();

  const rows: CourseRow[] = courses.map((c) => ({
    code: c.code,
    subject: c.subject,
    level: c.level,
    title: c.title,
    credits: c.credits,
    description: c.description,
    pathwaysConcepts: c.pathwaysConcepts,
  }));

  const subjects = [...new Set(courses.map((c) => c.subject))].sort();
  const pathwayConcepts = [
    ...new Set(courses.flatMap((c) => c.pathwaysConcepts)),
  ].sort(naturalConceptSort);

  return (
    <Suspense>
      <CourseSearch
        courses={rows}
        subjects={subjects}
        pathwayConcepts={pathwayConcepts}
      />
    </Suspense>
  );
}
