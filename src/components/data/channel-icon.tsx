import type { Channel } from "@/lib/types";
import { Hash, Ticket, ClipboardList, Mail, Video, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<Channel, React.ElementType> = {
  slack: Hash,
  zendesk: Ticket,
  survey: ClipboardList,
  gmail: Mail,
  zoom: Video,
  crm: Database,
};

const LABEL: Record<Channel, string> = {
  slack: "Slack",
  zendesk: "Zendesk",
  survey: "Survey",
  gmail: "Email",
  zoom: "Zoom",
  crm: "CRM",
};

export function ChannelIcon({
  channel,
  size = 12,
  withLabel = false,
  className,
}: {
  channel: Channel;
  size?: number;
  withLabel?: boolean;
  className?: string;
}) {
  const Icon = ICON_MAP[channel];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-ink-3", className)}>
      <Icon style={{ width: size, height: size }} className="shrink-0" strokeWidth={1.75} />
      {withLabel && (
        <span className="kicker !text-[10px] !tracking-[0.1em]">{LABEL[channel]}</span>
      )}
    </span>
  );
}
