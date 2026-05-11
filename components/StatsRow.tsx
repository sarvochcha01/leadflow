"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Clock4, TrendingUp } from "lucide-react";

interface StatsData {
  totalLeads: number;
  newThisMonth: number;
  wonCount: number;
  conversionRate: number;
  followUpsDue: number;
  overdueCount: number;
}

export default function StatsRow() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const items = [
    {
      label: "Total leads",
      value: stats?.totalLeads ?? "—",
      sub: stats ? `+${stats.newThisMonth} this month` : "",
      subColor: "var(--color-status-won)",
      icon: <Users size={14} />,
      iconColor: "var(--color-brand-400)",
    },
    {
      label: "Won",
      value: stats?.wonCount ?? "—",
      sub: stats ? `${stats.conversionRate}% conversion` : "",
      subColor: "var(--color-status-won)",
      icon: <Trophy size={14} />,
      iconColor: "var(--color-status-won)",
    },
    {
      label: "Follow-ups due",
      value: stats?.followUpsDue ?? "—",
      sub: stats?.overdueCount ? `${stats.overdueCount} overdue` : "None overdue",
      subColor: stats?.overdueCount ? "var(--color-red)" : "var(--color-text-tertiary)",
      icon: <Clock4 size={14} />,
      iconColor: "var(--color-gold)",
    },
    {
      label: "Pipeline",
      value: stats ? `${stats.totalLeads - stats.wonCount}` : "—",
      sub: "Active leads",
      subColor: "var(--color-text-tertiary)",
      icon: <TrendingUp size={14} />,
      iconColor: "var(--color-status-contacted)",
    },
  ];

  return (
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-[10px] border p-[18px]"
          style={{
            background: "var(--color-surface-1)",
            borderColor: "var(--color-border-subtle)",
          }}
        >
          <div
            className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <span style={{ color: s.iconColor }}>{s.icon}</span>
            {s.label}
          </div>
          <div
            className="text-[26px] font-light tracking-[-0.5px]"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-text-primary)",
            }}
          >
            {s.value}
          </div>
          {s.sub && (
            <div
              className="mt-1.5 text-[12px] font-medium"
              style={{ color: s.subColor ?? "var(--color-text-tertiary)" }}
            >
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
