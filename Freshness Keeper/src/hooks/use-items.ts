import { useCallback, useEffect, useState } from "react";
import type { Energy, Item } from "@/lib/freshness";

const STORAGE_KEY = "laundry-list:v1";
const SEED_FLAG = "laundry-list:seeded";

const DAY = 24 * 60 * 60 * 1000;

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function seedItems(): Item[] {
  const now = Date.now();
  return [
    { id: makeId(), name: "Call mom", cadenceDays: 7, energy: "social", lastTendedAt: now - 6 * DAY, createdAt: now },
    { id: makeId(), name: "Gym", cadenceDays: 3, energy: "physical", lastTendedAt: now - 2 * DAY, createdAt: now },
    { id: makeId(), name: "Cook a real meal", cadenceDays: 1, energy: "errand", lastTendedAt: now - 0.4 * DAY, createdAt: now },
    { id: makeId(), name: "Water the plants", cadenceDays: 7, energy: "admin", lastTendedAt: now - 3 * DAY, createdAt: now },
  ];
}

function load(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Item[];
    if (!window.localStorage.getItem(SEED_FLAG)) {
      const seeded = seedItems();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      window.localStorage.setItem(SEED_FLAG, "1");
      return seeded;
    }
  } catch {
    /* ignore */
  }
  return [];
}

function save(items: Item[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    setItems(load());
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 10_000);
    return () => window.clearInterval(id);
  }, []);

  const add = useCallback(
    (input: { name: string; cadenceDays: number; energy: Energy }) => {
      setItems((prev) => {
        const next: Item[] = [
          ...prev,
          {
            id: makeId(),
            name: input.name.trim(),
            cadenceDays: input.cadenceDays,
            energy: input.energy,
            lastTendedAt: Date.now(),
            createdAt: Date.now(),
          },
        ];
        save(next);
        return next;
      });
    },
    [],
  );

  const tend = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, lastTendedAt: Date.now() } : it));
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      save(next);
      return next;
    });
  }, []);

  return { items, add, tend, remove };
}