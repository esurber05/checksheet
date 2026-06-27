import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentRecord } from "@/lib/supabase/student";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

type ProgramMeta = { programId: string; programName: string };

async function loadPrograms(): Promise<ProgramMeta[]> {
  const dir = path.join(process.cwd(), "data", "programs");
  const files = await readdir(dir);
  const results: ProgramMeta[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await readFile(path.join(dir, file), "utf-8");
    const data = JSON.parse(raw) as { programId?: string; programName?: string };
    if (data.programId && data.programName) {
      results.push({ programId: data.programId, programName: data.programName });
    }
  }
  return results.sort((a, b) => a.programName.localeCompare(b.programName));
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If the user already has a record, skip onboarding
  const existing = await getStudentRecord(supabase, user.id);
  if (existing) redirect("/audit/" + existing.studentId);

  const programs = await loadPrograms();
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 py-12">
      <OnboardingForm programs={programs} error={error} />
    </div>
  );
}
