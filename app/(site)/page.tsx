import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="border border-stone-200 rounded-lg p-8 bg-white text-center">
        <p className="text-stone-600 mb-4 text-sm">Sample student audit</p>
        <Link
          href="/audit/S00001"
          className="text-maroon font-medium hover:text-maroon-hover underline underline-offset-2"
        >
          View Alex Chen → /audit/S00001
        </Link>
      </div>
    </div>
  );
}
