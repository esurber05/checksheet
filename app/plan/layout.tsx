import IconRail from "@/components/layout/IconRail";
import { createClient } from "@/lib/supabase/server";
import { getSessionStudentId } from "@/lib/supabase/student";

export default async function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const studentId = await getSessionStudentId(supabase);

  return (
    <div className="flex h-screen overflow-hidden">
      <IconRail studentId={studentId} />
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}
