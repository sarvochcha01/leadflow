"use client";

import { useState, useRef } from "react";
import { Send, CalendarClock } from "lucide-react";

interface DiscussionFormProps {
  onSubmit: (note: string, followUpAt?: string) => Promise<void>;
}

export default function DiscussionForm({ onSubmit }: DiscussionFormProps) {
  const [note, setNote] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim() || submitting) return;

    let followUpAt: string | undefined;
    if (showFollowUp && followUpDate) {
      const time = followUpTime || "09:00";
      followUpAt = `${followUpDate}T${time}:00`;
    }

    setSubmitting(true);
    try {
      await onSubmit(note.trim(), followUpAt);
      setNote("");
      setShowFollowUp(false);
      setFollowUpDate("");
      setFollowUpTime("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border p-4"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Log a new discussion..."
        rows={3}
        className="w-full resize-none rounded-[6px] border p-3 text-[13px] leading-relaxed outline-none transition-colors"
        style={{
          background: "var(--color-surface-0)",
          borderColor: "var(--color-border-subtle)",
          color: "var(--color-text-primary)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border-strong)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border-subtle)")
        }
      />

      {/* Follow-up toggle + inputs */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label
          className="flex cursor-pointer items-center gap-2 text-[12px] font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <input
            type="checkbox"
            checked={showFollowUp}
            onChange={(e) => setShowFollowUp(e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer rounded accent-brand-500"
          />
          <CalendarClock size={13} />
          Set Follow-up
        </label>

        {showFollowUp && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="h-[30px] rounded-[5px] border px-2.5 text-[12px] outline-none"
              style={{
                background: "var(--color-surface-0)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-primary)",
                colorScheme: "dark",
              }}
            />
            <input
              type="time"
              value={followUpTime}
              onChange={(e) => setFollowUpTime(e.target.value)}
              className="h-[30px] rounded-[5px] border px-2.5 text-[12px] outline-none"
              style={{
                background: "var(--color-surface-0)",
                borderColor: "var(--color-border-subtle)",
                color: "var(--color-text-primary)",
                colorScheme: "dark",
              }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!note.trim() || submitting}
          className="ml-auto flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[6px] px-4 text-[12px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "var(--color-brand-500)",
            boxShadow: note.trim()
              ? "0 0 12px rgba(99,102,241,.2)"
              : "none",
          }}
        >
          <Send size={12} />
          {submitting ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
}
