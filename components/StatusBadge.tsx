import type { LeadStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  LeadStatus,
  { color: string; bg: string; border: string }
> = {
  New: {
    color: "var(--color-status-new)",
    bg: "var(--color-status-new-bg)",
    border: "var(--color-status-new-border)",
  },
  Contacted: {
    color: "var(--color-status-contacted)",
    bg: "var(--color-status-contacted-bg)",
    border: "var(--color-status-contacted-border)",
  },
  Qualified: {
    color: "var(--color-status-qualified)",
    bg: "var(--color-status-qualified-bg)",
    border: "var(--color-status-qualified-border)",
  },
  "Proposal Sent": {
    color: "var(--color-status-proposal)",
    bg: "var(--color-status-proposal-bg)",
    border: "var(--color-status-proposal-border)",
  },
  Won: {
    color: "var(--color-status-won)",
    bg: "var(--color-status-won-bg)",
    border: "var(--color-status-won-border)",
  },
  Lost: {
    color: "var(--color-status-lost)",
    bg: "var(--color-status-lost-bg)",
    border: "var(--color-status-lost-border)",
  },
};

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-[9px] py-[3px] text-[10px] font-bold uppercase tracking-[0.07em] ${className}`}
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {status}
    </span>
  );
}
