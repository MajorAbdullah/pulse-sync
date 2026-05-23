import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-paper hover:bg-ink-2 border border-ink",
        secondary:
          "bg-card text-ink border border-rule-strong hover:bg-paper-2 hover:border-ink-3",
        ghost: "text-ink hover:bg-paper-2 border border-transparent",
        outline:
          "border border-rule-strong bg-transparent text-ink hover:bg-paper-2 hover:border-ink-3",
        danger:
          "bg-brick text-paper hover:bg-brick-strong border border-brick",
        link: "text-ink underline-offset-4 hover:underline border-none p-0 h-auto",
      },
      size: {
        sm: "h-7 px-2.5 text-xs rounded-[3px]",
        md: "h-9 px-3.5 text-sm rounded-[4px]",
        lg: "h-10 px-5 text-sm rounded-[4px]",
        icon: "h-8 w-8 rounded-[3px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
