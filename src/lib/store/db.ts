import Dexie, { type Table } from "dexie";

import type { KioskStore } from "@/lib/types";

export type StoreSnapshot = {
  id: "local";
  data: KioskStore;
  updatedAt: string;
};

class KioskDexie extends Dexie {
  snapshots!: Table<StoreSnapshot, "local">;

  constructor() {
    super("22b-kiosk");

    this.version(1).stores({
      snapshots: "id"
    });
  }
}

let db: KioskDexie | null = null;

export function getDb() {
  if (!db) {
    db = new KioskDexie();
  }

  return db;
}
