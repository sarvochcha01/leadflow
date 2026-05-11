"use client";

import { useState, useRef, useEffect } from "react";
import { X, UserPlus } from "lucide-react";

interface AddLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddLeadDialog({
  open,
  onClose,
  onCreated,
}: AddLeadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Open / close ─────────────────────────────────────────
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      // Focus name field after animation
      setTimeout(() => nameRef.current?.focus(), 100);
    } else {
      dialog.close();
    }
  }, [open]);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setName("");
      setCompany("");
      setPhone("");
      setError("");
    }
  }, [open]);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  // ── Submit ───────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      nameRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create lead");
      }

      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="m-0 w-full max-w-[440px] overflow-hidden rounded-[14px] border p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-[6px]"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border-default)",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* ── Header ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px]"
              style={{ background: "var(--color-brand-500)", color: "white" }}
            >
              <UserPlus size={14} />
            </div>
            <h2
              className="text-[15px] font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Add New Lead
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[6px] border transition-colors"
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

        {/* ── Form body ───────────────────────────────────── */}
        <div className="space-y-4 px-6 py-5">
          {/* Error banner */}
          {error && (
            <div
              className="rounded-[6px] px-3 py-2 text-[12px] font-medium"
              style={{
                background: "var(--color-red-bg)",
                color: "var(--color-red)",
              }}
            >
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Full Name <span style={{ color: "var(--color-red)" }}>*</span>
            </label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              className="h-[38px] w-full rounded-[6px] border px-3 text-[13px] outline-none transition-colors"
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
          </div>

          {/* Company */}
          <div>
            <label
              className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Company{" "}
              <span
                className="font-normal normal-case tracking-normal"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                (Optional)
              </span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Stark Industries"
              className="h-[38px] w-full rounded-[6px] border px-3 text-[13px] outline-none transition-colors"
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
          </div>

          {/* Phone */}
          <div>
            <label
              className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Phone{" "}
              <span
                className="font-normal normal-case tracking-normal"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                (Optional)
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 555-0123"
              className="h-[38px] w-full rounded-[6px] border px-3 text-[13px] outline-none transition-colors"
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
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div
          className="flex items-center justify-end gap-2.5 border-t px-6 py-4"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="h-[34px] cursor-pointer rounded-[6px] border px-4 text-[13px] font-medium transition-all hover:brightness-110"
            style={{
              background: "transparent",
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-[34px] cursor-pointer rounded-[6px] px-4 text-[13px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: "var(--color-brand-500)",
              boxShadow: "0 0 12px rgba(99,102,241,.2)",
            }}
          >
            {submitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
