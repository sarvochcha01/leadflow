import { Users, Trophy, Clock4, TrendingUp } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
  iconColor: string;
}

const STATS: Stat[] = [
  {
    label: "Total leads",
    value: 48,
    sub: "+6 this month",
    subColor: "var(--color-status-won)",
    icon: <Users size={14} />,
    iconColor: "var(--color-brand-400)",
  },
  {
    label: "Won",
    value: 12,
    sub: "25% conversion",
    subColor: "var(--color-status-won)",
    icon: <Trophy size={14} />,
    iconColor: "var(--color-status-won)",
  },
  {
    label: "Follow-ups due",
    value: 3,
    sub: "2 overdue",
    subColor: "var(--color-gold)",
    icon: <Clock4 size={14} />,
    iconColor: "var(--color-gold)",
  },
  {
    label: "Pipeline value",
    value: "$84k",
    sub: "Up from $71k",
    subColor: "var(--color-status-won)",
    icon: <TrendingUp size={14} />,
    iconColor: "var(--color-status-contacted)",
  },
];

export default function StatsRow() {
  return (
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((s) => (
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
