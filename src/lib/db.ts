import fs from "fs";
import path from "path";
import { DB } from "./types";

// Simple file-backed JSON store.
// This is intentionally a swap-in point: replace the read/write functions
// below with a real database (Postgres/Prisma, etc.) without touching any
// of the call sites, which only ever import { readDB, writeDB } from here.

const DATA_DIR = path.join(process.cwd(), "data");
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

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(emptyDB(), null, 2));
  }
}

// naive in-process write lock to avoid interleaved writes during a request
let writeQueue: Promise<unknown> = Promise.resolve();

export function readDB(): DB {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Partial<DB>;
    return { ...emptyDB(), ...parsed };
  } catch {
    return emptyDB();
  }
}

export function writeDB(db: DB): void {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

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
