"use client";

import Link from "next/link";
import {
  Activity,
  BellRing,
  Plug,
  ClipboardList,
  Cog,
  ChevronsUpDown,
  Building2,
} from "lucide-react";
import { NavLink } from "./nav-link";
import { Avatar } from "../ui/avatar";
import { alerts, currentUser, orgName } from "@/lib/mock/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Sidebar() {
  const openAlerts = alerts.filter((a) => a.status === "open").length;

  return (
    <aside className="hidden md:flex flex-col w-[244px] shrink-0 bg-paper border-r border-rule h-screen sticky top-0">
      {/* Brand */}
      <div className="px-4 pt-5 pb-3">
        <Link href="/dashboard" className="flex items-baseline gap-1.5">
          <span className="display-tight text-[22px] text-ink">
            Pulse<span className="text-rust">·</span>IQ
          </span>
          <span className="kicker !text-[8.5px] !tracking-[0.18em]">v0.1 · prototype</span>
        </Link>
      </div>

      {/* Org switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="mx-3 mb-4 flex items-center gap-2.5 px-2.5 py-2 rounded-[4px] border border-rule hover:border-rule-strong hover:bg-paper-2 transition-colors text-left">
            <span className="size-7 rounded-[3px] bg-ink flex items-center justify-center">
              <Building2 className="size-3.5 text-paper" strokeWidth={1.75} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink truncate">{orgName}</span>
              <span className="block kicker !text-[9px] !tracking-[0.12em]">Enterprise · pilot</span>
            </span>
            <ChevronsUpDown className="size-3.5 text-ink-3" strokeWidth={1.75} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuItem>
            <span className="size-5 rounded-[3px] bg-ink shrink-0" />
            <span className="flex-1 truncate">{orgName}</span>
            <span className="mono text-[10px] text-ink-3">current</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="size-5 rounded-[3px] bg-sage shrink-0" />
            <span className="flex-1 truncate">Inflectiv Demo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>+ Create workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div className="kicker px-3 pb-2 pt-1">Monitoring</div>
        <NavLink
          href="/dashboard"
          icon={<Activity strokeWidth={1.75} />}
          label="Portfolio"
          exact
        />
        <NavLink
          href="/dashboard/alerts"
          icon={<BellRing strokeWidth={1.75} />}
          label="Alerts"
          hint={openAlerts}
        />

        <div className="kicker px-3 pt-5 pb-2">Sources</div>
        <NavLink
          href="/dashboard/integrations"
          icon={<Plug strokeWidth={1.75} />}
          label="Integrations"
        />
        <NavLink
          href="/dashboard/surveys"
          icon={<ClipboardList strokeWidth={1.75} />}
          label="Surveys"
        />

        <div className="kicker px-3 pt-5 pb-2">Workspace</div>
        <NavLink
          href="/dashboard/settings"
          icon={<Cog strokeWidth={1.75} />}
          label="Settings"
        />
      </nav>

      {/* Footer user */}
      <div className="border-t border-rule px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] hover:bg-paper-2 transition-colors text-left">
              <Avatar initials={currentUser.initials} size={26} />
              <span className="flex-1 min-w-0">
                <span className="block text-[12.5px] font-semibold text-ink truncate">{currentUser.name}</span>
                <span className="block mono !text-[10.5px] text-ink-3 truncate">{currentUser.email}</span>
              </span>
              <ChevronsUpDown className="size-3.5 text-ink-3" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-[220px]">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <DropdownMenuItem className="flex-col items-start gap-0">
              <span className="text-sm text-ink">{currentUser.name}</span>
              <span className="mono text-[10px] text-ink-3">{currentUser.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account preferences</DropdownMenuItem>
            <DropdownMenuItem>Notification rules</DropdownMenuItem>
            <DropdownMenuItem>Theme · Paper (default)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/sign-in">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
