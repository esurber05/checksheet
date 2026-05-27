import * as React from "react";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "flex h-9 w-full rounded-md border border-stone-200 bg-white px-3 py-1 text-sm",
        "text-stone-900 placeholder:text-stone-400",
        "focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
