"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  count?: number;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

function SegmentedControlInner<T extends string = string>(
  { options, value, onChange, className }: SegmentedControlProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-[50px] items-center gap-1 rounded-[64px] p-1",
        "bg-[var(--app-bg)] border border-[var(--border)]",
        className
      )}
      role="tablist"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex h-full min-h-[38px] items-center justify-center gap-2 rounded-[64px] px-5 py-3 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-50)] focus-visible:ring-offset-1",
            value === opt.value
              ? "bg-[var(--blue-50)] text-[var(--white)]"
              : "bg-[var(--white)] text-[var(--black)] hover:bg-[var(--app-bg)]"
          )}
          style={{ padding: "12px 20px" }}
        >
          <span>{opt.label}</span>
          {opt.count !== undefined && <span className="opacity-90">({opt.count})</span>}
        </button>
      ))}
    </div>
  );
}

const SegmentedControl = React.forwardRef(SegmentedControlInner) as <
  T extends string = string
>(
  props: SegmentedControlProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export { SegmentedControl };
