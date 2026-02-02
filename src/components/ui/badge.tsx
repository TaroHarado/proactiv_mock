import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-[#2563eb] text-white",
        secondary: "bg-[#f1f5f9] text-[#475569]",
        success: "bg-[#dcfce7] text-[#166534]",
        warning: "bg-[#fef3c7] text-[#92400e]",
        destructive: "bg-[#fee2e2] text-[#991b1b]",
        outline: "border border-[#e2e8f0] bg-white text-[#334155]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
