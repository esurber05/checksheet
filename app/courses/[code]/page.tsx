import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { lookupCourse } from "@/lib/catalog";
import type { Course } from "@/lib/schemas/course";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { code } = await params;
  const course = lookupCourse(decodeURIComponent(code));

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Course Catalog
        </Link>
        <p className="text-stone-600">
          Course{" "}
          <span className="font-mono">{decodeURIComponent(code)}</span> not
          found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Course Catalog
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="font-mono text-sm text-stone-500">{course.code}</span>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mt-1 mb-3">
          {course.title}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
          <span>{creditLabel(course.credits)}</span>
          <span>{course.level}-level</span>
          {course.contactHours && <span>{course.contactHours}</span>}
        </div>
      </div>

      {/* Sections */}
      <div className="divide-y divide-stone-200">
        {course.description && (
          <Section label="Description">
            <p className="text-stone-700 leading-relaxed">{course.description}</p>
          </Section>
        )}

        {course.prerequisites && (
          <Section label="Prerequisites">
            {course.prerequisites.rawText && (
              <p className="text-stone-700 mb-3">{course.prerequisites.rawText}</p>
            )}
            {course.prerequisites.referencedCourses.length > 0 && (
              <CourseBadgeList codes={course.prerequisites.referencedCourses} />
            )}
          </Section>
        )}

        {course.corequisites && (
          <Section label="Corequisites">
            {course.corequisites.rawText && (
              <p className="text-stone-700 mb-3">{course.corequisites.rawText}</p>
            )}
            {course.corequisites.referencedCourses.length > 0 && (
              <CourseBadgeList codes={course.corequisites.referencedCourses} />
            )}
          </Section>
        )}

        {course.pathwaysConcepts.length > 0 && (
          <Section label="Pathway Concepts">
            <div className="flex flex-wrap gap-1.5">
              {course.pathwaysConcepts.map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700"
                >
                  {id}
                </span>
              ))}
            </div>
          </Section>
        )}

        {course.crossListedWith.length > 0 && (
          <Section label="Cross-listed With">
            <CourseBadgeList codes={course.crossListedWith} />
          </Section>
        )}

        {course.repeatability && (
          <Section label="Repeatability">
            <p className="text-stone-700">{course.repeatability}</p>
          </Section>
        )}
      </div>

      {/* External link */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <a
          href={course.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-maroon hover:text-maroon-hover"
        >
          View in VT Catalog
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

function CourseBadgeList({ codes }: { codes: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {codes.map((code) => (
        <Link
          key={code}
          href={`/courses/${encodeURIComponent(code)}`}
          className="rounded-full bg-maroon-light px-2.5 py-0.5 text-xs font-mono text-maroon hover:bg-maroon hover:text-white transition-colors"
        >
          {code}
        </Link>
      ))}
    </div>
  );
}

function creditLabel(credits: Course["credits"]): string {
  return credits.min === credits.max
    ? `${credits.min} credits`
    : `${credits.min}–${credits.max} credits`;
}
