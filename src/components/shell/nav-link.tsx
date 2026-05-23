"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  hint?: string | number;
  exact?: boolean;
}

export function NavLink({ href, icon, label, hint, exact }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2.5 pl-3 pr-2 h-8 rounded-[4px] text-[13px] font-medium transition-colors",
        active
          ? "bg-paper-3 text-ink"
          : "text-ink-2 hover:bg-paper-2 hover:text-ink",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-ink rounded-full" />
      )}
      <span className={cn("[&_svg]:size-[14px] shrink-0", active ? "text-ink" : "text-ink-3 group-hover:text-ink")}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {hint !== undefined && (
        <span
          className={cn(
            "mono text-[10px] px-1.5 py-px rounded-[2px]",
            active ? "bg-ink text-paper" : "bg-paper-3 text-ink-3 group-hover:bg-paper-3",
          )}
        >
          {hint}
        </span>
      )}
    </Link>
  );
}
