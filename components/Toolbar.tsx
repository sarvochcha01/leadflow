"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { LeadStatus } from "@/lib/types";

const FILTERS: Array<"All" | LeadStatus> = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Won",
];

interface ToolbarProps {
  onSearch?: (q: string) => void;
  onFilter?: (filter: "All" | LeadStatus) => void;
}

export default function Toolbar({ onSearch, onFilter }: ToolbarProps) {
  const [active, setActive] = useState<"All" | LeadStatus>("All");

  function handleFilter(f: "All" | LeadStatus) {
    setActive(f);
    onFilter?.(f);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      {/* Search */}
      <div className="relative flex-1" style={{ maxWidth: "280px" }}>
        <Search
          size={15}
          className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-text-tertiary)" }}
        />
        <input
          type="text"
          placeholder="Search leads, companies..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="h-[34px] w-full rounded-[6px] border pl-[32px] pr-3 text-[13px] outline-none transition-colors"
          style={{
            background: "var(--color-surface-1)",
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

      {/* Filter tabs */}
      <div className="flex gap-1">
        {FILTERS.map((f) => {
          const isActive = active === f;
          return (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className="h-[30px] cursor-pointer rounded-[6px] border px-3 text-[12px] font-medium transition-all"
              style={{
                background: isActive ? "var(--color-surface-2)" : "transparent",
                borderColor: isActive
                  ? "var(--color-border-default)"
                  : "transparent",
                color: isActive
                  ? "var(--color-text-primary)"
                  : "var(--color-text-tertiary)",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}
