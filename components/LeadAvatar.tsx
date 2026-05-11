import type { LeadStatus } from "@/lib/types";

const STATUS_AVATAR_STYLE: Record<LeadStatus, { color: string; bg: string }> = {
  New:             { color: "#60a5fa", bg: "rgba(96,165,250,.15)"  },
  Contacted:       { color: "#a78bfa", bg: "rgba(167,139,250,.15)" },
  Qualified:       { color: "#fbbf24", bg: "rgba(251,191,36,.15)"  },
  "Proposal Sent": { color: "#f472b6", bg: "rgba(244,114,182,.15)" },
  Won:             { color: "#22c55e", bg: "rgba(34,197,94,.15)"   },
  Lost:            { color: "#6b7280", bg: "rgba(107,114,128,.15)" },
};

interface LeadAvatarProps {
  name: string;
  status: LeadStatus;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function LeadAvatar({ name, status }: LeadAvatarProps) {
  const { color, bg } = STATUS_AVATAR_STYLE[status];
  return (
    <div
      className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[9px] text-[12px] font-semibold tracking-[0.5px]"
      style={{ color, background: bg }}
    >
      {getInitials(name)}
    </div>
  );
}
