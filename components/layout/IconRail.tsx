"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutPanelLeft,
  Search,
  ClipboardList,
  User,
  Bookmark,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function IconRail({ studentId }: { studentId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const NAV_ITEMS = [
    { label: "Plan", icon: LayoutPanelLeft, href: studentId ? `/plan/${studentId}` : "#" },
    { label: "Courses", icon: Search, href: "/courses" },
    { label: "Audit", icon: ClipboardList, href: studentId ? `/audit/${studentId}` : "#" },
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Saved", icon: Bookmark, href: "#" },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-[72px] shrink-0 h-screen bg-white border-r border-stone-200 flex flex-col items-center py-4 gap-1">
      {/* Logo mark */}
      <div className="w-9 h-9 rounded-lg bg-maroon flex items-center justify-center mb-4 shrink-0">
        <span className="font-serif text-white text-xs font-bold leading-none">
          CS
        </span>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const prefixMap: Record<string, string> = {
          Plan: "/plan",
          Audit: "/audit",
          Profile: "/profile",
        };
        const isActive =
          href !== "#" && pathname.startsWith(prefixMap[label] ?? href);
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={[
              "flex flex-col items-center gap-1 w-14 px-1 py-2 rounded-lg transition-colors",
              isActive
                ? "bg-maroon/10 text-maroon"
                : "text-stone-400 hover:text-stone-600 hover:bg-stone-100",
            ].join(" ")}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}

      {/* Logout pushed to bottom */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          aria-label="Sign out"
          className="flex flex-col items-center gap-1 w-14 px-1 py-2 rounded-lg transition-colors text-stone-400 hover:text-stone-600 hover:bg-stone-100"
        >
          <LogOut size={18} strokeWidth={1.75} />
          <span className="text-[10px] font-medium leading-none">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
