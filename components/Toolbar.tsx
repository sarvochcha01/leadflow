"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { LeadStatus } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";

const FILTERS: Array<"All" | LeadStatus> = ["All", ...LEAD_STATUSES];

interface ToolbarProps {
  onSearch?: (q: string) => void;
  onFilter?: (filter: "All" | LeadStatus) => void;
  statusCounts?: Record<string, number>;
  totalCount?: number;
}

export default function Toolbar({
  onSearch,
  onFilter,
  statusCounts = {},
  totalCount = 0,
}: ToolbarProps) {
  const [active, setActive] = useState<"All" | LeadStatus>("All");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFilter(f: "All" | LeadStatus) {
    setActive(f);
    onFilter?.(f);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    onSearch?.(value);
  }

  function clearSearch() {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  }

  // Keyboard: Escape to clear search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        clearSearch();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search leads, companies..."
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-[34px] w-full rounded-[6px] border pl-[32px] pr-8 text-[13px] outline-none transition-colors"
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
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-[8px] top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 transition-colors"
            style={{ color: "var(--color-text-tertiary)", background: "transparent" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-tertiary)")
            }
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {FILTERS.map((f) => {
          const isActive = active === f;
          const count = f === "All" ? totalCount : (statusCounts[f] ?? 0);
          return (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className="flex h-[30px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] border px-3 text-[12px] font-medium transition-all"
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
              {count > 0 && (
                <span
                  className="rounded-[3px] px-[5px] py-[1px] text-[10px] font-bold"
                  style={{
                    background: isActive
                      ? "var(--color-border-default)"
                      : "var(--color-surface-2)",
                    color: isActive
                      ? "var(--color-text-primary)"
                      : "var(--color-text-tertiary)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
