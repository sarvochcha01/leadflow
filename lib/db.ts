import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import {
  CREATE_LEADS_TABLE,
  CREATE_DISCUSSIONS_TABLE,
  CREATE_DISCUSSIONS_LEAD_IDX,
} from "./schema";

const DB_PATH = process.env.DATABASE_PATH || "./data/leadflow.db";

// Ensure the directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Run schema migrations
db.exec(CREATE_LEADS_TABLE);
db.exec(CREATE_DISCUSSIONS_TABLE);
db.exec(CREATE_DISCUSSIONS_LEAD_IDX);

export default db;
