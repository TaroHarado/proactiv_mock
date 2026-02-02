"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  title,
  side = "right",
  className,
}: SheetProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-lg bg-white shadow-xl flex flex-col",
          side === "right" ? "right-0" : "left-0",
          "rounded-l-2xl border-l border-[#e2e8f0]",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
            <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
