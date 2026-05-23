import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-1.5 py-[1px] text-[10.5px] font-medium uppercase tracking-[0.08em] rounded-[2px] border whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-paper-2 text-ink-2 border-rule-strong",
        sage: "bg-sage-tint text-sage-deep border-sage/30",
        rust: "bg-rust-tint text-rust-deep border-rust/30",
        brick: "bg-brick-tint text-brick-deep border-brick/30",
        ink: "bg-ink text-paper border-ink",
        outline: "bg-transparent text-ink-2 border-rule-strong",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
