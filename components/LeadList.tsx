"use client";

import { isToday, isBefore } from "date-fns";
import { Users } from "lucide-react";
import LeadCard from "./LeadCard";
import type { LeadListItem } from "@/lib/types";

interface LeadListProps {
  leads: LeadListItem[];
  onSelectLead: (lead: LeadListItem) => void;
}

/* ── Section header ─────────────────────────────────────────── */
function SectionLabel({
  children,
  color,
  count,
}: {
  children: React.ReactNode;
  color: string;
  count?: number;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span
        className="h-[6px] w-[6px] flex-shrink-0 rounded-full"
        style={{ background: color }}
      />
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color }}
      >
        {children}
      </span>
      {count !== undefined && (
        <span
          className="rounded-[4px] px-[7px] py-[1px] text-[10px] font-bold"
          style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          {count}
        </span>
      )}
      <span
        className="h-px flex-1"
        style={{ background: "var(--color-border-subtle)" }}
      />
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-[12px]"
        style={{ background: "var(--color-surface-2)" }}
      >
        <Users size={24} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
      <p
        className="text-[15px] font-medium"
        style={{ color: "var(--color-text-primary)" }}
      >
        No leads found
      </p>
      <p
        className="mt-1 text-[13px]"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Adjust your filters or add a new lead to get started.
      </p>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function LeadList({ leads, onSelectLead }: LeadListProps) {
  if (leads.length === 0) return <EmptyState />;

  const now = new Date();

  // Today but still upcoming (time hasn't passed yet)
  const todayFollowUps = leads.filter((l) => {
    if (!l.follow_up_at) return false;
    const d = new Date(l.follow_up_at);
    return isToday(d) && !isBefore(d, now);
  });

  // Any follow-up whose time has passed (including earlier today)
  const overdueFollowUps = leads.filter((l) => {
    if (!l.follow_up_at) return false;
    const d = new Date(l.follow_up_at);
    return isBefore(d, now);
  });

  const priorityIds = new Set([
    ...todayFollowUps.map((l) => l.id),
    ...overdueFollowUps.map((l) => l.id),
  ]);

  const otherLeads = leads.filter((l) => !priorityIds.has(l.id));

  return (
    <div className="space-y-6">
      {todayFollowUps.length > 0 && (
        <section>
          <SectionLabel color="var(--color-gold)" count={todayFollowUps.length}>
            Today&apos;s follow-ups
          </SectionLabel>
          <div className="space-y-1.5">
            {todayFollowUps.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onClick={() => onSelectLead(lead)} />
            ))}
          </div>
        </section>
      )}

      {overdueFollowUps.length > 0 && (
        <section>
          <SectionLabel color="var(--color-red)" count={overdueFollowUps.length}>
            Overdue
          </SectionLabel>
          <div className="space-y-1.5">
            {overdueFollowUps.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onClick={() => onSelectLead(lead)} />
            ))}
          </div>
        </section>
      )}

      {otherLeads.length > 0 && (
        <section>
          <SectionLabel color="var(--color-text-tertiary)">All leads</SectionLabel>
          <div className="space-y-1.5">
            {otherLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onClick={() => onSelectLead(lead)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
