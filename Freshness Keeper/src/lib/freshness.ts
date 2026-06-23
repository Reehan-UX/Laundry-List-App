export type Energy = "focus" | "admin" | "physical" | "social" | "errand" | "creative";

export type Item = {
  id: string;
  name: string;
  cadenceDays: number;
  energy: Energy;
  lastTendedAt: number;
  createdAt: number;
};

export const ENERGIES: { value: Energy; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "focus", label: "Focus" },
  { value: "physical", label: "Physical" },
  { value: "social", label: "Social" },
  { value: "errand", label: "Errand" },
  { value: "creative", label: "Creative" },
];

export const CADENCES: { value: number; label: string }[] = [
  { value: 1, label: "Daily" },
  { value: 3, label: "Few days" },
  { value: 7, label: "Weekly" },
  { value: 30, label: "Monthly" },
];

const DAY = 24 * 60 * 60 * 1000;

export function freshness(item: Item, now: number = Date.now()): number {
  const elapsed = now - item.lastTendedAt;
  const total = item.cadenceDays * DAY;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - elapsed / total));
}

export type Band = "fresh" | "waning" | "stale";

export function band(f: number): Band {
  if (f >= 0.66) return "fresh";
  if (f >= 0.33) return "waning";
  return "stale";
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function energyLabel(e: Energy): string {
  return ENERGIES.find((x) => x.value === e)?.label ?? e;
}