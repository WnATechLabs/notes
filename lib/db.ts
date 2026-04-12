import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const dbPath = process.env.DB_PATH || "data/app.db";

mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL REFERENCES user(id),
    content TEXT NOT NULL,
    isPublic INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
  )
`);

export default db;
