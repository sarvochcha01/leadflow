// ── Lead Statuses ──────────────────────────────────────────────────
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

// ── Database Row Types ─────────────────────────────────────────────
export interface LeadRow {
  id: number;
  name: string;
  company: string | null;
  phone: string | null;
  status: LeadStatus;
  follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscussionRow {
  id: number;
  lead_id: number;
  note: string;
  follow_up_at: string | null;
  created_at: string;
}

// ── API Response Types ─────────────────────────────────────────────

/** Lead as returned by the list endpoint (includes last note preview). */
export interface LeadListItem extends LeadRow {
  last_note: string | null;
  last_discussion_at: string | null;
}

/** Full lead detail returned by the single-lead endpoint. */
export interface LeadDetail extends LeadRow {
  discussions: DiscussionRow[];
}

// ── API Request Types ──────────────────────────────────────────────
export interface CreateLeadPayload {
  name: string;
  company?: string;
  phone?: string;
}

export interface UpdateLeadPayload {
  status: LeadStatus;
}

export interface CreateDiscussionPayload {
  note: string;
  follow_up_at?: string; // ISO 8601 datetime
}
