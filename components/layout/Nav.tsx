import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-semibold text-maroon">
          Checksheet
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/courses" className="text-stone-600 hover:text-stone-900">
            Courses
          </Link>
          <Link href="/audit/S00001" className="text-stone-600 hover:text-stone-900">
            Audit
          </Link>
          <span className="text-stone-400 cursor-default">Planner</span>
          <span className="text-stone-400 cursor-default">Settings</span>
        </div>
      </div>
    </nav>
  );
}
