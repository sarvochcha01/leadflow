/** SQL statements to initialise the LeadFlow database schema. */

export const CREATE_LEADS_TABLE = `
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    company     TEXT,
    phone       TEXT,
    status      TEXT    NOT NULL DEFAULT 'New',
    follow_up_at TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_DISCUSSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS discussions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id      INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    note         TEXT    NOT NULL,
    follow_up_at TEXT,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`;

export const CREATE_DISCUSSIONS_LEAD_IDX = `
  CREATE INDEX IF NOT EXISTS idx_discussions_lead_id
  ON discussions(lead_id);
`;
