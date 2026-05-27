import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({
  className,
  variant = "default",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-maroon disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

  const variants: Record<string, string> = {
    default: "bg-maroon text-white hover:bg-maroon-hover",
    outline:
      "border border-stone-200 bg-white text-stone-900 hover:bg-stone-100",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
  };

  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
