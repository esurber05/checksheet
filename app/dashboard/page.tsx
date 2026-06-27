import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentRecord } from "@/lib/supabase/student";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const record = await getStudentRecord(supabase, user.id);

  if (!record) redirect("/onboarding");

  redirect("/audit/" + record.studentId);
}
