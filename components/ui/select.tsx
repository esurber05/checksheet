import * as React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  active?: boolean;
}

export function Select({ className, active, children, ...props }: SelectProps) {
  return (
    <div
      className={[
        "relative inline-flex items-center",
        active ? "border-b-2 border-maroon" : "border-b-2 border-transparent",
      ].join(" ")}
    >
      <select
        className={[
          "h-9 appearance-none rounded-md border border-stone-200 bg-white pl-3 pr-8 text-sm",
          "text-stone-900 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent",
          active && "border-maroon",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-stone-400" />
    </div>
  );
}
