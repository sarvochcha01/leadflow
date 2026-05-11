"use client";

import { useState, useEffect, useCallback } from "react";
import type { LeadListItem, LeadStatus } from "@/lib/types";
import Header from "@/components/Header";
import LeadList from "@/components/LeadList";
import StatsRow from "@/components/StatsRow";
import Toolbar from "@/components/Toolbar";

export default function Home() {
  const [leads, setLeads] = useState<LeadListItem[]>([]);
  const [filtered, setFiltered] = useState<LeadListItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch ──────────────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: LeadListItem[] = await res.json();
      setLeads(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /* ── Search + filter ────────────────────────────────────── */
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LeadStatus>("All");

  useEffect(() => {
    let result = leads;
    if (statusFilter !== "All") {
      result = result.filter((l) => l.status === statusFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [query, statusFilter, leads]);

  /* ── Handlers (placeholders for Phase 3 & 4) ───────────── */
  const handleAddLead = () => {
    console.log("Add lead clicked");
  };

  const handleSelectLead = (lead: LeadListItem) => {
    console.log("Selected lead:", lead.name);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onAddLead={handleAddLead} />

      <main className="mx-auto w-full max-w-[860px] flex-1 px-6 py-7">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <StatsRow />
            <Toolbar
              onSearch={setQuery}
              onFilter={setStatusFilter}
            />
            <LeadList leads={filtered} onSelectLead={handleSelectLead} />
          </>
        )}
      </main>
    </div>
  );
}

/* ── Loading skeleton ───────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="space-y-2.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[10px] border p-[18px]"
          style={{
            background: "var(--color-surface-1)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="h-[38px] w-[38px] flex-shrink-0 rounded-[9px]"
              style={{ background: "var(--color-surface-3)" }}
            />
            <div className="flex-1 space-y-2">
              <div
                className="h-[14px] w-[160px] rounded-[4px]"
                style={{ background: "var(--color-surface-3)" }}
              />
              <div
                className="h-[12px] w-[260px] rounded-[4px]"
                style={{ background: "var(--color-surface-2)" }}
              />
            </div>
            <div
              className="h-[22px] w-[72px] rounded-[4px]"
              style={{ background: "var(--color-surface-3)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
