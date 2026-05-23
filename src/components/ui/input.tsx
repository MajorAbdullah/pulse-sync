import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full h-9 px-3 text-sm bg-card border border-rule-strong rounded-[4px] text-ink placeholder:text-ink-4 transition-colors hover:border-ink-3 focus:border-ink focus:outline-none focus-visible:outline-none",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "kicker block mb-1.5",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
