import fs from "fs";
import path from "path";
import { DB } from "./types";

// Simple file-backed JSON store, with an in-memory fallback for hosting
// environments (like Vercel) where the filesystem can't be written to.
// This is intentionally a swap-in point: replace the read/write functions
// below with a real database (Postgres/Prisma, etc.) without touching any
// of the call sites, which only ever import { readDB, writeDB } from here.
//
// Vercel's serverless functions can't write inside the deployed project
// folder (process.cwd()) — that's read-only. /tmp is the one directory
// they CAN write to, and it stays around for the life of that warm
// function instance, which is what actually lets signup -> redirect ->
// next page work in one sitting instead of losing the user in between.

const DATA_DIR = process.env.VERCEL ? "/tmp/credable-data" : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function emptyDB(): DB {
  return {
    users: [],
    runs: [],
    messages: [],
    worries: [],
    goals: [],
    financialItems: [],
    scenarios: [],
    schoolProgress: [],
    resources: [],
    handoffs: [],
  };
}

// In-memory fallback, used when the filesystem can't be written to (e.g.
// Vercel's serverless functions). Keeps the app working for a session
// instead of crashing; just isn't guaranteed to persist between requests
// on a fresh server instance.
let memoryDB: DB | null = null;
let fsWritable = true;

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(emptyDB(), null, 2));
  }
}

export function readDB(): DB {
  if (!fsWritable) return memoryDB ?? emptyDB();
  try {
    ensureFile();
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return { ...emptyDB(), ...parsed };
  } catch {
    fsWritable = false;
    return memoryDB ?? emptyDB();
  }
}

export function writeDB(db: DB): void {
  if (!fsWritable) {
    memoryDB = db;
    return;
  }
  try {
    ensureFile();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch {
    fsWritable = false;
    memoryDB = db;
  }
}

// naive in-process write lock to avoid interleaved writes during a request
let writeQueue: Promise<unknown> = Promise.resolve();

// Convenience helper: read, mutate, write, return the mutation's result.
export async function mutateDB<T>(fn: (db: DB) => T): Promise<T> {
  const run = async () => {
    const db = readDB();
    const result = fn(db);
    writeDB(db);
    return result;
  };
  const next = writeQueue.then(run, run);
  writeQueue = next.catch(() => undefined);
  return next;
}
