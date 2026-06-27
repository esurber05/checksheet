"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStudentRecord } from "@/lib/supabase/student";
import { StudentRecordSchema } from "@/lib/schemas/student.ts";

export async function createProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const displayName = (formData.get("displayName") as string).trim();
  const enrolledSemester = formData.get("enrolledSemester") as string;
  const catalogYear = formData.get("catalogYear") as string;
  const programId = formData.get("programId") as string;

  // Build a minimal valid StudentRecord — studentId will be assigned by createStudentRecord
  const recordInput = {
    studentId: "TEMP",
    displayName,
    catalogYear,
    enrolledSemester,
    programs: [{ programId, type: "major" as const }],
    courseRecord: [],
    advisorApprovals: [],
    admissions: {},
  };

  const parsed = StudentRecordSchema.safeParse(recordInput);
  if (!parsed.success) {
    redirect(
      `/onboarding?error=${encodeURIComponent("Invalid profile data. Please check your inputs.")}`
    );
  }

  const record = await createStudentRecord(supabase, user.id, parsed.data);

  redirect("/audit/" + record.studentId);
}
