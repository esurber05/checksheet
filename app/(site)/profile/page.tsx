import { readFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentRecord, updateStudentRecord } from "@/lib/supabase/student";
import { parseProgram } from "@/lib/schemas/program.ts";

async function updateDisplayName(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const record = await getStudentRecord(supabase, user.id);
  if (!record) redirect("/onboarding");

  const displayName = (formData.get("displayName") as string).trim();
  if (displayName) {
    await updateStudentRecord(supabase, user.id, { ...record, displayName });
  }
  redirect("/profile");
}

function formatSemester(s: string) {
  const [term, year] = s.split("_");
  return `${term.charAt(0).toUpperCase()}${term.slice(1)} ${year}`;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const record = await getStudentRecord(supabase, user.id);
  if (!record) redirect("/onboarding");

  // Load program name
  let programName = record.programs[0]?.programId ?? "Unknown";
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "programs", `${record.programs[0].programId}.json`),
      "utf-8"
    );
    const prog = parseProgram(JSON.parse(raw));
    programName = prog.programName;
  } catch {
    // Program file may not exist yet
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">Profile</h1>
        <p className="mt-2 text-stone-500 text-sm">{user.email}</p>
      </div>

      {/* Info cards */}
      <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100">
        {[
          { label: "Program", value: programName },
          { label: "Enrolled", value: formatSemester(record.enrolledSemester) },
          { label: "Catalog year", value: record.catalogYear },
          ...(record.expectedGraduation
            ? [{ label: "Expected graduation", value: formatSemester(record.expectedGraduation) }]
            : []),
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between px-5 py-3 text-sm">
            <span className="text-stone-500">{label}</span>
            <span className="font-medium text-stone-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Edit display name */}
      <div>
        <h2 className="text-sm font-medium text-stone-700 mb-3">Display name</h2>
        <form action={updateDisplayName} className="flex gap-2">
          <input
            name="displayName"
            type="text"
            defaultValue={record.displayName}
            className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
