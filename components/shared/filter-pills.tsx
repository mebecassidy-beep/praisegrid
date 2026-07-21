"use client";

import { cn } from "@/lib/utils";

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            active === option.value
              ? "border-blue-500 bg-blue-500/10 text-blue-600"
              : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
