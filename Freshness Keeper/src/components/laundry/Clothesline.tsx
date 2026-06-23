import { useEffect, useState } from "react";
import { band, energyLabel, freshness, type Item } from "@/lib/freshness";

const ENERGY_ICON: Record<string, string> = {
  admin: "✎",
  focus: "◎",
  physical: "△",
  social: "♡",
  errand: "✦",
  creative: "✿",
};

export function Clothesline({
  items,
  onTend,
}: {
  items: Item[];
  onTend: (id: string) => void;
}) {
  // items already sorted stalest-first
  const hanging = items.filter((it) => freshness(it) < 0.5);
  const [leaving, setLeaving] = useState<Set<string>>(new Set());

  // Clear leaving ids that are no longer hanging
  useEffect(() => {
    if (leaving.size === 0) return;
    const ids = new Set(hanging.map((h) => h.id));
    let changed = false;
    const next = new Set(leaving);
    for (const id of leaving) if (!ids.has(id)) { next.delete(id); changed = true; }
    if (changed) setLeaving(next);
  }, [hanging, leaving]);

  function handleTend(id: string) {
    setLeaving((s) => new Set(s).add(id));
    window.setTimeout(() => onTend(id), 600);
  }

  return (
    <section className="relative" aria-label="Clothesline">
      {/* Rope */}
      <div className="relative h-[210px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-3"
          aria-hidden
        >
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent 0, color-mix(in oklab, var(--ink) 55%, transparent) 6%, color-mix(in oklab, var(--ink) 55%, transparent) 94%, transparent 100%)",
            }}
          />
          {/* gentle sag */}
          <div
            className="mx-[6%] -mt-px h-2"
            style={{
              borderBottom: "1px solid color-mix(in oklab, var(--ink) 18%, transparent)",
              borderRadius: "0 0 100% 100% / 0 0 100% 100%",
            }}
          />
        </div>

        {hanging.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pt-6">
            <p className="font-display text-[18px] italic text-ink/55">
              Line's clear — you're caught up.
            </p>
          </div>
        ) : (
          <div className="absolute inset-x-0 top-3 flex justify-center gap-3 px-3 overflow-x-auto pb-4">
            {hanging.map((item, i) => (
              <HangingTag
                key={item.id}
                item={item}
                index={i}
                leaving={leaving.has(item.id)}
                onTend={handleTend}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HangingTag({
  item,
  index,
  leaving,
  onTend,
}: {
  item: Item;
  index: number;
  leaving: boolean;
  onTend: (id: string) => void;
}) {
  const f = freshness(item);
  const b = band(f);
  const pegColor =
    b === "stale" ? "var(--stale)" : b === "waning" ? "var(--waning)" : "var(--fresh)";
  // staler hangs lower
  const drop = Math.round((1 - f) * 22); // 0..22px extra drop
  const tilt = ((index % 2 === 0 ? -1 : 1) * (0.4 + (index % 3) * 0.2)).toFixed(2);
  const swayDur = (5.5 + (index % 4) * 0.7).toFixed(2) + "s";
  const swayDelay = (-(index % 5) * 0.9).toFixed(2) + "s";
  const stringHeight = 26 + drop;

  return (
    <div
      className="relative flex flex-col items-center shrink-0"
      style={{ width: 116 }}
    >
      {/* Peg */}
      <div
        className={`relative z-10 h-3 w-5 rounded-[3px] border border-ink/30 transition-opacity duration-300 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: pegColor }}
        aria-hidden
      />
      {/* String */}
      <div
        className={`w-px bg-ink/35 transition-opacity duration-300 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
        style={{ height: stringHeight }}
        aria-hidden
      />
      {/* Tag */}
      <button
        onClick={() => onTend(item.id)}
        className={`group relative w-full rounded-xl border border-border bg-card px-2.5 py-2 text-left shadow-[0_6px_14px_-10px_rgba(41,36,33,0.45)] active:scale-[0.98] cursor-pointer ${
          leaving ? "liftoff pointer-events-none" : "hang"
        }`}
        style={{
          ["--tilt" as string]: `${tilt}deg`,
          ["--sway-dur" as string]: swayDur,
          animationDelay: leaving ? "0s" : swayDelay,
        }}
        aria-label={`Tend ${item.name}`}
        title={`Tend ${item.name}`}
      >
        <div className="flex items-start gap-1.5">
          <span className="mt-0.5 text-[13px] leading-none text-ink/70" aria-hidden>
            {ENERGY_ICON[item.energy] ?? "•"}
          </span>
          <span className="font-display text-[14px] leading-[1.05] tracking-tight text-ink line-clamp-2">
            {item.name}
          </span>
        </div>
        <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-ink/45">
          {energyLabel(item.energy)}
        </p>
      </button>
    </div>
  );
}