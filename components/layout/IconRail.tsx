"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutPanelLeft,
  Search,
  ClipboardList,
  User,
  Bookmark,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Plan", icon: LayoutPanelLeft, href: "/plan/S00001" },
  { label: "Courses", icon: Search, href: "/courses" },
  { label: "Audit", icon: ClipboardList, href: "/audit/S00001" },
  { label: "Profile", icon: User, href: "#" },
  { label: "Saved", icon: Bookmark, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function IconRail() {
  const pathname = usePathname();

  return (
    <aside className="w-[72px] shrink-0 h-screen bg-white border-r border-stone-200 flex flex-col items-center py-4 gap-1">
      {/* Logo mark */}
      <div className="w-9 h-9 rounded-lg bg-maroon flex items-center justify-center mb-4 shrink-0">
        <span className="font-serif text-white text-xs font-bold leading-none">CS</span>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const prefixMap: Record<string, string> = {
          Plan: "/plan",
          Audit: "/audit",
        };
        const isActive = href !== "#" && pathname.startsWith(prefixMap[label] ?? href);
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
    </aside>
  );
}
