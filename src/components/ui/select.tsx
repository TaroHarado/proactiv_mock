"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full appearance-none rounded-xl border border-[#e2e8f0] bg-white pl-3 pr-9 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-0 disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-[#64748b]" />
  </div>
));
Select.displayName = "Select";

export { Select };
