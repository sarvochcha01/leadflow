"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { LEAD_STATUSES } from "@/lib/types";
import type { LeadStatus } from "@/lib/types";

interface StatusDropdownProps {
  current: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

export default function StatusDropdown({ current, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-3 py-1.5 text-[12px] font-medium transition-all"
        style={{
          background: "var(--color-surface-2)",
          borderColor: open ? "var(--color-border-strong)" : "var(--color-border-default)",
          color: "var(--color-text-primary)",
        }}
      >
        {current}
        <ChevronDown
          size={13}
          className="transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-[170px] overflow-hidden rounded-[8px] border py-1 shadow-xl"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border-default)",
          }}
        >
          {LEAD_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[13px] transition-colors"
              style={{
                color:
                  current === status
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                background: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-surface-3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span className="w-4">
                {current === status && <Check size={13} />}
              </span>
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
