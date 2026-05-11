import db from "@/lib/db";

interface StatsData {
  totalLeads: number;
  newThisMonth: number;
  wonCount: number;
  conversionRate: number;
  followUpsDue: number;
  overdueCount: number;
}

// ── GET /api/stats ─────────────────────────────────────────────────
export async function GET() {
  try {
    // Compute comparison dates in JS (ISO format with Z)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const totalLeads = (
      db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number }
    ).count;

    const newThisMonth = (
      db
        .prepare(
          "SELECT COUNT(*) as count FROM leads WHERE created_at >= ?"
        )
        .get(startOfMonth) as { count: number }
    ).count;

    const wonCount = (
      db
        .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Won'")
        .get() as { count: number }
    ).count;

    const conversionRate =
      totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

    // Follow-ups due today or in the future
    const followUpsDue = (
      db
        .prepare(
          "SELECT COUNT(*) as count FROM leads WHERE follow_up_at IS NOT NULL AND follow_up_at >= ?"
        )
        .get(startOfDay) as { count: number }
    ).count;

    // Overdue follow-ups (before today)
    const overdueCount = (
      db
        .prepare(
          "SELECT COUNT(*) as count FROM leads WHERE follow_up_at IS NOT NULL AND follow_up_at < ?"
        )
        .get(startOfDay) as { count: number }
    ).count;

    const stats: StatsData = {
      totalLeads,
      newThisMonth,
      wonCount,
      conversionRate,
      followUpsDue,
      overdueCount,
    };

    return Response.json(stats, { status: 200 });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return Response.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
