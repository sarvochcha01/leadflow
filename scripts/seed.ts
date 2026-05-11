/**
 * Seed script — populates the database with 5+ leads and discussions.
 *
 * Run with: npx tsx scripts/seed.ts
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH || "./data/leadflow.db";

// Ensure data directory
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Create tables ──────────────────────────────────────────────────
db.exec(`
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
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS discussions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id      INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    note         TEXT    NOT NULL,
    follow_up_at TEXT,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_discussions_lead_id
  ON discussions(lead_id);
`);

// ── Clear existing data ────────────────────────────────────────────
db.exec("DELETE FROM discussions;");
db.exec("DELETE FROM leads;");
db.exec("DELETE FROM sqlite_sequence WHERE name='leads' OR name='discussions';");

// ── Helper: date offsets ───────────────────────────────────────────
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function todayAt(hour: number, minute: number = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

// ── Seed Leads ─────────────────────────────────────────────────────
const insertLead = db.prepare(`
  INSERT INTO leads (name, company, phone, status, follow_up_at, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertDiscussion = db.prepare(`
  INSERT INTO discussions (lead_id, note, follow_up_at, created_at)
  VALUES (?, ?, ?, ?)
`);

const seedData = db.transaction(() => {
  // ── Lead 1: Sarah Connor ─────────────────────────────────────
  const sarah = insertLead.run(
    "Sarah Connor",
    "Acme Corp",
    "555-0199",
    "Proposal Sent",
    todayAt(14, 0), // Follow-up today at 2:00 PM
    daysAgo(10),
    daysAgo(2)
  );

  insertDiscussion.run(
    sarah.lastInsertRowid,
    "Lead created via web form.",
    null,
    daysAgo(10)
  );

  insertDiscussion.run(
    sarah.lastInsertRowid,
    "Initial discovery call. They need a CRM for 50 reps. Pain points include dropping leads and no follow-up tracking.",
    null,
    daysAgo(5)
  );

  insertDiscussion.run(
    sarah.lastInsertRowid,
    "Sent pricing tier PDF. Said she would review with her boss.",
    todayAt(14, 0), // Follow-up set for today
    daysAgo(2)
  );

  // ── Lead 2: Hank Scorpio ─────────────────────────────────────
  const hank = insertLead.run(
    "Hank Scorpio",
    "Globex",
    "555-0742",
    "New",
    null,
    hoursAgo(3),
    hoursAgo(2)
  );

  insertDiscussion.run(
    hank.lastInsertRowid,
    "Inbound lead from website contact form.",
    null,
    hoursAgo(2)
  );

  // ── Lead 3: Bill Lumbergh ────────────────────────────────────
  const bill = insertLead.run(
    "Bill Lumbergh",
    "Initech",
    "555-0456",
    "Contacted",
    daysFromNow(3),
    daysAgo(14),
    daysAgo(7)
  );

  insertDiscussion.run(
    bill.lastInsertRowid,
    "Cold outreach via LinkedIn. No response yet.",
    null,
    daysAgo(14)
  );

  insertDiscussion.run(
    bill.lastInsertRowid,
    "Left a voicemail with his assistant.",
    daysFromNow(3),
    daysAgo(7)
  );

  // ── Lead 4: Bruce Wayne ─────────────────────────────────────
  const bruce = insertLead.run(
    "Bruce Wayne",
    "Wayne Ent.",
    "555-0001",
    "Won",
    null,
    daysAgo(45),
    daysAgo(21)
  );

  insertDiscussion.run(
    bruce.lastInsertRowid,
    "Met at a networking event. Very interested in enterprise tier.",
    null,
    daysAgo(45)
  );

  insertDiscussion.run(
    bruce.lastInsertRowid,
    "Demo call went great. Wants to onboard 200 seats.",
    null,
    daysAgo(30)
  );

  insertDiscussion.run(
    bruce.lastInsertRowid,
    "Contract signed! Sending welcome package.",
    null,
    daysAgo(21)
  );

  // ── Lead 5: Leia Organa ──────────────────────────────────────
  const leia = insertLead.run(
    "Leia Organa",
    "Rebel Alliance",
    "555-1138",
    "Qualified",
    todayAt(10, 30), // Follow-up today at 10:30 AM
    daysAgo(20),
    daysAgo(3)
  );

  insertDiscussion.run(
    leia.lastInsertRowid,
    "Referral from existing customer. They have 30 field reps needing mobile CRM.",
    null,
    daysAgo(20)
  );

  insertDiscussion.run(
    leia.lastInsertRowid,
    "Scheduled a product demo for next week.",
    todayAt(10, 30),
    daysAgo(3)
  );

  // ── Lead 6: Tony Stark ──────────────────────────────────────
  const tony = insertLead.run(
    "Tony Stark",
    "Stark Industries",
    "555-3000",
    "Proposal Sent",
    daysAgo(2), // Overdue follow-up!
    daysAgo(30),
    daysAgo(5)
  );

  insertDiscussion.run(
    tony.lastInsertRowid,
    "Inbound from trade show booth scan.",
    null,
    daysAgo(30)
  );

  insertDiscussion.run(
    tony.lastInsertRowid,
    "Wants AI-powered pipeline features. Sent custom proposal.",
    daysAgo(2), // This follow-up is overdue
    daysAgo(5)
  );

  // ── Lead 7: Dwight Schrute ──────────────────────────────────
  const dwight = insertLead.run(
    "Dwight Schrute",
    "Dunder Mifflin",
    "555-7739",
    "Lost",
    null,
    daysAgo(60),
    daysAgo(40)
  );

  insertDiscussion.run(
    dwight.lastInsertRowid,
    "Interested in paper supply tracking module.",
    null,
    daysAgo(60)
  );

  insertDiscussion.run(
    dwight.lastInsertRowid,
    "Said they decided to go with a competitor. Budget constraints.",
    null,
    daysAgo(40)
  );
});

seedData();

console.log("✅ Database seeded successfully!");
console.log(`   Database path: ${path.resolve(DB_PATH)}`);

const leadCount = (db.prepare("SELECT COUNT(*) as count FROM leads").get() as { count: number }).count;
const discCount = (db.prepare("SELECT COUNT(*) as count FROM discussions").get() as { count: number }).count;

console.log(`   ${leadCount} leads, ${discCount} discussions`);

db.close();
