"use client";

import { formatDistanceToNow, isToday, isBefore, format } from "date-fns";
import { MessageCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import LeadAvatar from "./LeadAvatar";
import type { LeadListItem } from "@/lib/types";

interface LeadCardProps {
  lead: LeadListItem;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const followUp = lead.follow_up_at ? new Date(lead.follow_up_at) : null;
  const isFollowUpToday = followUp ? isToday(followUp) : false;
  const isOverdue =
    followUp && !isToday(followUp) ? isBefore(followUp, new Date()) : false;

  const timeAgo = lead.last_discussion_at
    ? formatDistanceToNow(new Date(lead.last_discussion_at), { addSuffix: true })
    : null;

  /* Left accent stripe colour */
  const accentColor = isFollowUpToday
    ? "var(--color-gold)"
    : isOverdue
    ? "var(--color-red)"
    : "transparent";

  /* Card border colour */
  const borderColor = isFollowUpToday
    ? "rgba(201,168,76,.18)"
    : isOverdue
    ? "rgba(248,113,113,.18)"
    : "var(--color-border-subtle)";

  return (
    <button
      id={`lead-card-${lead.id}`}
      onClick={onClick}
      className="lead-card relative w-full cursor-pointer overflow-hidden rounded-[10px] border text-left"
      style={{
        background: "var(--color-surface-1)",
        borderColor,
      }}
    >
      {/* Left accent stripe */}
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: accentColor }}
      />

      <div className="flex items-center gap-4 px-[18px] py-4">
        <LeadAvatar name={lead.name} status={lead.status} />

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Name + company */}
          <div className="flex items-center gap-2">
            <span
              className="text-[14px] font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {lead.name}
            </span>
            {lead.company && (
              <span
                className="text-[13px]"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                · {lead.company}
              </span>
            )}
          </div>

          {/* Last note */}
          {lead.last_note && (
            <div
              className="mt-1.5 flex items-center gap-1.5 text-[12px]"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              <MessageCircle size={12} className="flex-shrink-0" />
              <span className="truncate">{lead.last_note}</span>
              {timeAgo && (
                <span className="flex-shrink-0 opacity-60">· {timeAgo}</span>
              )}
            </div>
          )}
        </div>

        {/* Right — badge + follow-up indicator */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <StatusBadge status={lead.status} />

          {isFollowUpToday && followUp && (
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium"
              style={{ color: "var(--color-gold)" }}
            >
              <span
                className="pulse-dot h-[5px] w-[5px] rounded-full"
                style={{ background: "var(--color-gold)" }}
              />
              Today, {format(followUp, "h:mm a")}
            </span>
          )}

          {isOverdue && followUp && (
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium"
              style={{ color: "var(--color-red)" }}
            >
              <span
                className="pulse-dot h-[5px] w-[5px] rounded-full"
                style={{ background: "var(--color-red)" }}
              />
              {formatDistanceToNow(followUp, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
