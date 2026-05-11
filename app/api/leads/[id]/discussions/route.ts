import { NextRequest } from "next/server";
import db from "@/lib/db";
import type { DiscussionRow, CreateDiscussionPayload } from "@/lib/types";

// ── GET /api/leads/[id]/discussions ────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const lead = db
      .prepare("SELECT id FROM leads WHERE id = ?")
      .get(Number(id));

    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    const discussions = db
      .prepare(
        "SELECT * FROM discussions WHERE lead_id = ? ORDER BY created_at DESC"
      )
      .all(Number(id)) as DiscussionRow[];

    return Response.json(discussions, { status: 200 });
  } catch (error) {
    console.error(`GET /api/leads/${id}/discussions error:`, error);
    return Response.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

// ── POST /api/leads/[id]/discussions ──────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as CreateDiscussionPayload;

    if (!body.note || !body.note.trim()) {
      return Response.json(
        { error: "Note is required" },
        { status: 400 }
      );
    }

    const lead = db
      .prepare("SELECT id FROM leads WHERE id = ?")
      .get(Number(id));

    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    // Insert the discussion
    const insertStmt = db.prepare(`
      INSERT INTO discussions (lead_id, note, follow_up_at)
      VALUES (?, ?, ?)
    `);

    const result = insertStmt.run(
      Number(id),
      body.note.trim(),
      body.follow_up_at || null
    );

    // If a follow-up was set, update the lead's follow_up_at
    if (body.follow_up_at) {
      db.prepare(
        "UPDATE leads SET follow_up_at = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(body.follow_up_at, Number(id));
    }

    // Always update the lead's updated_at timestamp
    db.prepare(
      "UPDATE leads SET updated_at = datetime('now') WHERE id = ?"
    ).run(Number(id));

    const discussion = db
      .prepare("SELECT * FROM discussions WHERE id = ?")
      .get(result.lastInsertRowid) as DiscussionRow;

    return Response.json(discussion, { status: 201 });
  } catch (error) {
    console.error(`POST /api/leads/${id}/discussions error:`, error);
    return Response.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
