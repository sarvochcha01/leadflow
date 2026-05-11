"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import type { DiscussionRow } from "@/lib/types";

interface TimelineEntryProps {
  discussion: DiscussionRow;
  isLatest: boolean;
}

export default function TimelineEntry({ discussion, isLatest }: TimelineEntryProps) {
  const createdAt = new Date(discussion.created_at);
  const followUp = discussion.follow_up_at
    ? new Date(discussion.follow_up_at)
    : null;

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className="mt-1 h-[10px] w-[10px] flex-shrink-0 rounded-full border-2"
          style={{
            borderColor: isLatest ? "var(--color-brand-500)" : "var(--color-border-strong)",
            background: isLatest ? "var(--color-brand-500)" : "transparent",
          }}
        />
        <div
          className="w-px flex-1"
          style={{ background: "var(--color-border-subtle)" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 -mt-0.5">
        {/* Date header */}
        <div
          className="mb-2 flex items-center gap-2 text-[12px] font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <span>{format(createdAt, "MMM d, yyyy 'at' h:mm a")}</span>
          <span style={{ color: "var(--color-text-tertiary)" }}>
            ({formatDistanceToNow(createdAt, { addSuffix: true })})
          </span>
        </div>

        {/* Note card */}
        <div
          className="rounded-[8px] border p-3.5 text-[13px] leading-relaxed"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border-subtle)",
            color: "var(--color-text-primary)",
          }}
        >
          {discussion.note}

          {/* Follow-up badge */}
          {followUp && (
            <div
              className="mt-3 flex items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-[11px] font-medium"
              style={{
                background: "var(--color-gold-bg)",
                color: "var(--color-gold)",
              }}
            >
              <Calendar size={12} />
              Follow-up set for: {format(followUp, "MMM d, h:mm a")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
