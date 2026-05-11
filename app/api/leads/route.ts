import { NextRequest } from "next/server";
import db from "@/lib/db";
import { LEAD_STATUSES } from "@/lib/types";
import type {
  LeadListItem,
  LeadRow,
  CreateLeadPayload,
  LeadStatus,
} from "@/lib/types";

// ── GET /api/leads ─────────────────────────────────────────────────
// Query params: ?status=New&search=acme
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status") as LeadStatus | null;
  const searchQuery = searchParams.get("search");

  let query = `
    SELECT
      l.*,
      d.note        AS last_note,
      d.created_at  AS last_discussion_at
    FROM leads l
    LEFT JOIN (
      SELECT lead_id, note, created_at,
             ROW_NUMBER() OVER (PARTITION BY lead_id ORDER BY created_at DESC) AS rn
      FROM discussions
    ) d ON d.lead_id = l.id AND d.rn = 1
  `;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (statusFilter && LEAD_STATUSES.includes(statusFilter)) {
    conditions.push("l.status = ?");
    params.push(statusFilter);
  }

  if (searchQuery && searchQuery.trim()) {
    conditions.push("l.name LIKE ?");
    params.push(`%${searchQuery.trim()}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY l.updated_at DESC";

  try {
    const leads = db.prepare(query).all(...params) as LeadListItem[];
    return Response.json(leads, { status: 200 });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return Response.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// ── POST /api/leads ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateLeadPayload;

    if (!body.name || !body.name.trim()) {
      return Response.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO leads (name, company, phone, status, created_at, updated_at)
      VALUES (?, ?, ?, 'New', ?, ?)
    `);

    const result = stmt.run(
      body.name.trim(),
      body.company?.trim() || null,
      body.phone?.trim() || null,
      now,
      now
    );

    const lead = db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .get(result.lastInsertRowid) as LeadRow;

    return Response.json(lead, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return Response.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
