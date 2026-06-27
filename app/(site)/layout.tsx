import IconRail from "@/components/layout/IconRail";
import { createClient } from "@/lib/supabase/server";
import { getSessionStudentId } from "@/lib/supabase/student";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const studentId = await getSessionStudentId(supabase);

  return (
    <div className="flex h-screen overflow-hidden">
      <IconRail studentId={studentId} />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
