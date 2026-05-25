/**
 * scrape-catalog
 *
 * Fetches VT undergraduate course pages and writes structured JSON.
 *
 * Usage:
 *   npx tsx scripts/scrape-catalog.ts cs
 *   npx tsx scripts/scrape-catalog.ts cs math hist
 *   npx tsx scripts/scrape-catalog.ts --all
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { parseSubjectPage } from "../lib/catalog-parser.ts";

const BASE_URL = "https://catalog.vt.edu/undergraduate/course-descriptions";
// catalog.vt.edu is protected by AWS WAF which blocks non-browser UAs.
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const THROTTLE_MS = 2000;

function currentCatalogYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

/**
 * Fetch the course-descriptions index page and return all subject slugs
 * in nav order, e.g. ["acis", "adv", "aoe", ...].
 */
async function fetchAllSubjects(): Promise<string[]> {
  const indexUrl = `${BASE_URL}/`;
  const html = await fetchHtml(indexUrl);
  const $ = load(html);

  const slugs: string[] = [];
  const SUBJECT_HREF_RE = /^\/undergraduate\/course-descriptions\/([a-z0-9]+)\/$/;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const match = href.match(SUBJECT_HREF_RE);
    if (match) slugs.push(match[1]);
  });

  if (slugs.length === 0) {
    throw new Error(
      "Found 0 subjects on the index page — the page structure may have changed",
    );
  }

  return [...new Set(slugs)];
}

async function scrapeSubject(
  subject: string,
  catalogYear: string,
  outputDir: string,
): Promise<number> {
  const subjectUpper = subject.toUpperCase();
  const url = `${BASE_URL}/${subject.toLowerCase()}/`;
  const html = await fetchHtml(url);
  const courses = parseSubjectPage(html, url, catalogYear);

  const output = {
    subject: subjectUpper,
    scrapedAt: new Date().toISOString(),
    catalogYear,
    courses,
  };

  mkdirSync(outputDir, { recursive: true });
  const outPath = path.join(outputDir, `${subjectUpper}.json`);
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  return courses.length;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isAll = args.includes("--all");

  if (!isAll && args.length === 0) {
    console.error("Usage: scrape-catalog.ts <subject> [subject...] | --all");
    process.exit(1);
  }

  const catalogYear = currentCatalogYear();
  const outputDir = path.join(process.cwd(), "data", "catalog", "by-subject");

  let subjects: string[];
  if (isAll) {
    process.stdout.write("Fetching subject list from catalog index... ");
    subjects = await fetchAllSubjects();
    console.log(`${subjects.length} subjects found`);
  } else {
    subjects = args;
  }

  const errors: Array<{ subject: string; message: string }> = [];

  for (let i = 0; i < subjects.length; i++) {
    if (i > 0) await sleep(THROTTLE_MS);
    const subjectUpper = subjects[i].toUpperCase();
    try {
      const count = await scrapeSubject(subjects[i], catalogYear, outputDir);
      const progress = isAll ? ` [${i + 1}/${subjects.length}]` : "";
      console.log(
        `✓${progress} ${subjectUpper}: ${count} courses → data/catalog/by-subject/${subjectUpper}.json`,
      );
    } catch (err) {
      const message = (err as Error).message;
      console.error(`✗ ${subjectUpper}: ${message}`);
      if (!isAll) process.exit(1);
      errors.push({ subject: subjectUpper, message });
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} subject(s) failed:`);
    for (const e of errors) console.error(`  ✗ ${e.subject}: ${e.message}`);
    process.exit(1);
  }

  if (isAll) {
    console.log(`\n✓ All ${subjects.length} subjects scraped.`);
  }
}

main();
