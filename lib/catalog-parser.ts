import { load } from "cheerio";
import { parseCourse } from "./schemas/course.ts";
import type { Course } from "./schemas/course.ts";

/** Collapse whitespace and strip non-breaking spaces. */
function normalize(text: string): string {
  return text.replace(/ /g, " ").replace(/\s+/g, " ").trim();
}

const CREDIT_REGEX_RANGE = /\((\d+)-(\d+)\s+credits?\)/i;
const CREDIT_REGEX_COMMA = /\((\d+(?:,\s*\d+)+)\s+credits?\)/i;
const CREDIT_REGEX_SINGLE = /\((\d+)\s+credits?\)/i;

function parseCredits(
  rawHours: string,
  courseCode: string,
): { min: number; max: number } {
  const text = normalize(rawHours);
  const rangeMatch = text.match(CREDIT_REGEX_RANGE);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }
  // "(1,2 credits)" — comma-separated option list; treat as min/max of listed values
  const commaMatch = text.match(CREDIT_REGEX_COMMA);
  if (commaMatch) {
    const nums = commaMatch[1].split(",").map((n) => parseInt(n.trim(), 10));
    return { min: Math.min(...nums), max: Math.max(...nums) };
  }
  const singleMatch = text.match(CREDIT_REGEX_SINGLE);
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    return { min: n, max: n };
  }
  throw new Error(
    `Cannot parse credits from "${rawHours}" for ${courseCode} — add a special case`,
  );
}

const PATHWAYS_CONCEPT_RE = /^(1[AF]|[234]|5[AF]|6[AD]|7|1[01])/;

function parsePathways(text: string, courseCode: string): string[] {
  if (!text) return [];
  return text
    .split(",")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => {
      const match = chunk.match(PATHWAYS_CONCEPT_RE);
      if (!match) {
        // Strip known label prefix like "Pathways:" before throwing
        const firstToken = chunk.split(/\s/)[0];
        throw new Error(
          `Unrecognized Pathways concept ID "${firstToken}" in chunk "${chunk}" for course ${courseCode} — update the regex`,
        );
      }
      return match[1];
    });
}

/** Valid VT course code — mirrors CourseCodeSchema in program.ts */
const COURSE_CODE_RE = /^[A-Z]{2,5}\s\d{4,5}[A-Z]?$/;

function extractLinkedCourses($: ReturnType<typeof load>, el: ReturnType<typeof $>): string[] {
  const codes: string[] = [];
  el.find("a").each((_, a) => {
    const text = normalize($(a).text());
    // Skip placeholder/wildcard codes (e.g. "MATH 1XXX") — not real courses
    if (text && COURSE_CODE_RE.test(text)) codes.push(text);
  });
  return [...new Set(codes)].sort();
}

/**
 * Parse a VT undergraduate course-descriptions subject page into Course objects.
 */
export function parseSubjectPage(
  html: string,
  sourceUrl: string,
  catalogYear: string,
): Course[] {
  const $ = load(html);
  const courses: Course[] = [];

  $(".courseblock").each((_, blockEl) => {
    const $block = $(blockEl);

    // Code — "CS 3214"
    const code = normalize($block.find(".detail-code").text()).replace(/\s+/, " ");

    // Skip placeholder/wildcard entries (e.g. "VT 1XX5F", "PSCI 1XXX3") —
    // these appear in some subject pages as range indicators, not real courses.
    if (!COURSE_CODE_RE.test(code)) {
      process.stderr.write(`  skip non-course code: ${code}\n`);
      return;
    }

    // Title — strip leading "- "
    const titleRaw = normalize($block.find(".detail-title").text());
    const title = titleRaw.replace(/^-\s*/, "").trim();

    // Credits
    const hoursRaw = normalize($block.find(".detail-hours_html").text());
    const credits = parseCredits(hoursRaw, code);

    // Description (may be absent)
    const descEl = $block.find(".courseblockextra");
    const description = descEl.length > 0 ? normalize(descEl.text()) || undefined : undefined;

    // Prerequisites
    const $prereq = $block.find(".detail-prereq");
    let prerequisites: Course["prerequisites"];
    if ($prereq.length > 0) {
      const rawText = normalize($prereq.text())
        .replace(/^Prerequisite\(s\):\s*/i, "")
        .trim();
      const referencedCourses = extractLinkedCourses($, $prereq);
      prerequisites = { rawText: rawText || undefined, referencedCourses };
    }

    // Corequisites
    const $coreq = $block.find(".detail-coreq");
    let corequisites: Course["corequisites"];
    if ($coreq.length > 0) {
      const rawText = normalize($coreq.text())
        .replace(/^Corequisite\(s\):\s*/i, "")
        .trim();
      const referencedCourses = extractLinkedCourses($, $coreq);
      corequisites = { rawText: rawText || undefined, referencedCourses };
    }

    // Pathways concepts — strip "Pathway Concept Area(s): " label injected by <strong>
    const $pathway = $block.find(".detail-pathway");
    const pathwaysConcepts = (() => {
      if ($pathway.length === 0) return [];
      const pathwayRaw = normalize($pathway.text())
        .replace(/^Pathway Concept Area\(s\):\s*/i, "")
        .trim();
      return pathwayRaw ? parsePathways(pathwayRaw, code) : [];
    })();

    // Contact hours — strip "Instructional Contact Hours: " label injected by <strong>
    const $contact = $block.find(".detail-contact_hours");
    const contactHours =
      $contact.length > 0
        ? normalize($contact.text())
            .replace(/^Instructional Contact Hours:\s*/i, "")
            .trim() || undefined
        : undefined;

    // Cross-listed courses
    const crossListedWith = extractLinkedCourses($, $block.find(".detail-cross_listed"));

    // Repeatability
    const $repeat = $block.find(".detail-repeatability");
    const repeatability =
      $repeat.length > 0 ? normalize($repeat.text()) || undefined : undefined;

    // Derive subject, number, level from code
    const spaceIdx = code.indexOf(" ");
    const subject = code.slice(0, spaceIdx);
    const number = code.slice(spaceIdx + 1);
    const level = parseInt(number[0], 10) * 1000;

    const raw = {
      code,
      subject,
      number,
      level,
      title,
      credits,
      isVariableCredit: credits.min !== credits.max,
      description,
      prerequisites,
      corequisites,
      pathwaysConcepts,
      contactHours,
      crossListedWith,
      repeatability,
      sourceUrl,
      catalogYear,
    };

    try {
      courses.push(parseCourse(raw));
    } catch (err) {
      throw new Error(`Failed to parse course ${code}: ${(err as Error).message}`);
    }
  });

  return courses;
}
