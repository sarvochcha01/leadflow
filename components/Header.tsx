"use client";

import { Bell, Settings, Plus } from "lucide-react";

interface HeaderProps {
  onAddLead: () => void;
}

export default function Header({ onAddLead }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b px-6"
      style={{
        background: "var(--color-surface-1)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px]"
          style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}
        >
          <svg
            className="h-[15px] w-[15px] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span
          className="text-[20px] tracking-[-0.3px]"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-primary)" }}
        >
          Lead<span style={{ fontStyle: "italic", color: "var(--color-brand-400)" }}>Flow</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <IconButton aria-label="Notifications">
          <Bell size={15} />
        </IconButton>
        <IconButton aria-label="Settings">
          <Settings size={15} />
        </IconButton>

        <div
          className="mx-1 h-5 w-px"
          style={{ background: "var(--color-border-strong)" }}
        />

        <button
          onClick={onAddLead}
          className="flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[6px] border-0 px-[14px] text-[13px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.97]"
          style={{
            background: "var(--color-brand-500)",
            boxShadow: "0 0 16px rgba(99,102,241,.25)",
          }}
        >
          <Plus size={14} />
          Add lead
        </button>
      </div>
    </header>
  );
}

function IconButton({
  children,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[6px] border transition-all"
      style={{
        background: "transparent",
        borderColor: "var(--color-border-default)",
        color: "var(--color-text-secondary)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--color-surface-2)";
        (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
      }}
    >
      {children}
    </button>
  );
}
