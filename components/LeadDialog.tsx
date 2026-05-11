"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Phone } from "lucide-react";
import TimelineEntry from "./TimelineEntry";
import DiscussionForm from "./DiscussionForm";
import StatusDropdown from "./StatusDropdown";
import LeadAvatar from "./LeadAvatar";
import type { LeadDetail, LeadStatus, DiscussionRow } from "@/lib/types";

interface LeadDialogProps {
  leadId: number;
  open: boolean;
  onClose: () => void;
  onMutate: () => void; // refresh parent list after changes
}

export default function LeadDialog({
  leadId,
  open,
  onClose,
  onMutate,
}: LeadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch lead detail ────────────────────────────────────
  const fetchLead = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`);
      if (!res.ok) throw new Error("Failed to fetch lead");
      const data: LeadDetail = await res.json();
      setLead(data);
    } catch (err) {
      console.error("Error fetching lead:", err);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  // ── Open / close dialog ──────────────────────────────────
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      fetchLead();
    } else {
      dialog.close();
    }
  }, [open, fetchLead]);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  // ── Status change ────────────────────────────────────────
  async function handleStatusChange(status: LeadStatus) {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setLead((prev) => (prev ? { ...prev, status } : prev));
      onMutate();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  // ── Add discussion ───────────────────────────────────────
  async function handleAddDiscussion(note: string, followUpAt?: string) {
    try {
      const res = await fetch(`/api/leads/${leadId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, follow_up_at: followUpAt }),
      });
      if (!res.ok) throw new Error("Failed to add discussion");
      const newDiscussion: DiscussionRow = await res.json();
      setLead((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          discussions: [newDiscussion, ...prev.discussions],
          follow_up_at: followUpAt ?? prev.follow_up_at,
        };
      });
      onMutate();
    } catch (err) {
      console.error("Error adding discussion:", err);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="m-0 h-full max-h-[85vh] w-full max-w-[560px] overflow-hidden rounded-[14px] border p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-[6px]"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border-default)",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {lead && !loading ? (
        <div className="flex h-full flex-col">
          {/* ── Header ──────────────────────────────────────── */}
          <div
            className="flex items-start justify-between border-b px-6 py-5"
            style={{ borderColor: "var(--color-border-subtle)" }}
          >
            <div className="flex items-center gap-4">
              <LeadAvatar name={lead.name} status={lead.status} />
              <div>
                <h2
                  className="text-[16px] font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {lead.name}
                  {lead.company && (
                    <span
                      className="ml-2 text-[14px] font-normal"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      ({lead.company})
                    </span>
                  )}
                </h2>
                {lead.phone && (
                  <div
                    className="mt-1 flex items-center gap-1.5 text-[12px]"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <Phone size={11} />
                    {lead.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusDropdown
                current={lead.status}
                onChange={handleStatusChange}
              />
              <button
                onClick={onClose}
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[6px] border transition-colors"
                style={{
                  background: "transparent",
                  borderColor: "var(--color-border-default)",
                  color: "var(--color-text-tertiary)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-surface-3)";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--color-text-tertiary)";
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Timeline ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {lead.discussions.length > 0 ? (
              <div>
                {lead.discussions.map((d, i) => (
                  <TimelineEntry
                    key={d.id}
                    discussion={d}
                    isLatest={i === 0}
                  />
                ))}
              </div>
            ) : (
              <div
                className="flex items-center justify-center py-16 text-[13px]"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                No discussions yet. Add the first note below.
              </div>
            )}
          </div>

          {/* ── Discussion form ─────────────────────────────── */}
          <div
            className="border-t px-6 py-4"
            style={{ borderColor: "var(--color-border-subtle)" }}
          >
            <DiscussionForm onSubmit={handleAddDiscussion} />
          </div>
        </div>
      ) : (
        /* Loading state */
        <div className="flex h-full items-center justify-center">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--color-border-strong)", borderTopColor: "transparent" }}
          />
        </div>
      )}
    </dialog>
  );
}
