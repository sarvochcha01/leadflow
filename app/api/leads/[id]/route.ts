import { NextRequest } from "next/server";
import db from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/types";
import type {
  LeadRow,
  DiscussionRow,
  LeadDetail,
  UpdateLeadPayload,
  LeadStatus,
} from "@/lib/types";

// ── GET /api/leads/[id] ───────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const lead = db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .get(Number(id)) as LeadRow | undefined;

    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const discussions = db
      .prepare(
        "SELECT * FROM discussions WHERE lead_id = ? ORDER BY created_at DESC"
      )
      .all(Number(id)) as DiscussionRow[];

    const detail: LeadDetail = { ...lead, discussions };
    return Response.json(detail, { status: 200 });
  } catch (error) {
    console.error(`GET /api/leads/${id} error:`, error);
    return Response.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/leads/[id] ─────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as UpdateLeadPayload;

    if (!body.status || !LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return Response.json(
        {
          error: `Invalid status. Must be one of: ${LEAD_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT id FROM leads WHERE id = ?")
      .get(Number(id));

    if (!existing) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    db.prepare(
      "UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(body.status, Number(id));

    const updated = db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .get(Number(id)) as LeadRow;

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error(`PATCH /api/leads/${id} error:`, error);
    return Response.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
