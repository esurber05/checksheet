"use client";

import { useState } from "react";
import { createProfile } from "@/app/onboarding/actions";

type Program = { programId: string; programName: string };

const SEMESTERS: { value: string; label: string }[] = [];
for (let year = 2019; year <= 2028; year++) {
  SEMESTERS.push({ value: `fall_${year}`, label: `Fall ${year}` });
  SEMESTERS.push({ value: `spring_${year + 1}`, label: `Spring ${year + 1}` });
}

const CATALOG_YEARS = [
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

const STEPS = ["About you", "Catalog year", "Program", "Finish"];

const inputClass =
  "w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white transition-colors";

export default function OnboardingForm({
  programs,
  error,
}: {
  programs: Program[];
  error?: string;
}) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [enrolledSemester, setEnrolledSemester] = useState("fall_2023");
  const [catalogYear, setCatalogYear] = useState("2024-2025");
  const [programId, setProgramId] = useState(programs[0]?.programId ?? "");

  function canAdvance() {
    if (step === 0) return displayName.trim().length > 0;
    if (step === 1) return !!catalogYear;
    if (step === 2) return !!programId;
    return true;
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-maroon flex items-center justify-center">
          <span className="font-serif text-white text-sm font-bold leading-none">CS</span>
        </div>
      </div>

      <h1 className="text-2xl font-serif font-semibold text-stone-900 text-center mb-1">
        Set up your profile
      </h1>
      <p className="text-stone-600 text-sm text-center mb-8">
        Step {step + 1} of {STEPS.length}
      </p>

      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-maroon" : "bg-stone-200",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
        {error && (
          <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 0 — Name + semester */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-medium text-stone-900 mb-4">About you</h2>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Chen"
                className={inputClass}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Enrollment semester
              </label>
              <select
                value={enrolledSemester}
                onChange={(e) => setEnrolledSemester(e.target.value)}
                className={inputClass}
              >
                {SEMESTERS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 1 — Catalog year */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-medium text-stone-900 mb-1">Catalog year</h2>
            <p className="text-sm text-stone-500 mb-4">
              The academic year of the degree requirements you are following.
              When in doubt, choose the year you enrolled.
            </p>
            <div className="space-y-2">
              {CATALOG_YEARS.map((year) => (
                <label
                  key={year}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors",
                    catalogYear === year
                      ? "border-maroon bg-maroon/5 text-maroon"
                      : "border-stone-200 hover:bg-stone-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="catalogYear"
                    value={year}
                    checked={catalogYear === year}
                    onChange={() => setCatalogYear(year)}
                    className="accent-maroon"
                  />
                  <span className="text-sm font-medium">{year}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Program selection */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-medium text-stone-900 mb-1">Your program</h2>
            <p className="text-sm text-stone-500 mb-4">
              Select your primary degree program.
            </p>
            <div className="space-y-2">
              {programs.map((p) => (
                <label
                  key={p.programId}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors",
                    programId === p.programId
                      ? "border-maroon bg-maroon/5 text-maroon"
                      : "border-stone-200 hover:bg-stone-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="programId"
                    value={p.programId}
                    checked={programId === p.programId}
                    onChange={() => setProgramId(p.programId)}
                    className="accent-maroon"
                  />
                  <span className="text-sm font-medium">{p.programName}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Confirm + submit */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-medium text-stone-900 mb-4">Confirm your profile</h2>
            {[
              { label: "Name", value: displayName },
              { label: "Enrolled", value: enrolledSemester.replace("_", " ") },
              { label: "Catalog year", value: catalogYear },
              {
                label: "Program",
                value:
                  programs.find((p) => p.programId === programId)?.programName ??
                  programId,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-stone-500">{label}</span>
                <span className="font-medium text-stone-900 capitalize">{value}</span>
              </div>
            ))}
            <p className="text-xs text-stone-400 pt-2">
              You can change these later from your profile page.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex-1 py-2 px-4 text-sm font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className="flex-1 py-2 px-4 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <form action={createProfile} className="flex-1">
            <input type="hidden" name="displayName" value={displayName} />
            <input type="hidden" name="enrolledSemester" value={enrolledSemester} />
            <input type="hidden" name="catalogYear" value={catalogYear} />
            <input type="hidden" name="programId" value={programId} />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-maroon text-white text-sm font-medium rounded-lg hover:bg-maroon-hover transition-colors"
            >
              Create profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
