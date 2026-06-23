import { band, energyLabel, freshness, timeAgo, type Item } from "@/lib/freshness";
import { FreshnessBar } from "./FreshnessBar";

export function HeroCard({ item, onTend }: { item: Item; onTend: (id: string) => void }) {
  const f = freshness(item);
  const b = band(f);

  const tag =
    b === "stale"
      ? "bg-stale-surface text-ink border border-stale/40"
      : b === "waning"
        ? "bg-card text-ink border border-border"
        : "bg-card text-ink border border-border";
  const eyebrow =
    b === "stale" ? "Needs you most" : b === "waning" ? "Getting stale" : "All fresh — nice";

  return (
    <div className="relative pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-3 h-px bg-ink/30" />
      <div className="pointer-events-none absolute left-1/2 top-1 z-10 h-4 w-2.5 -translate-x-1/2 rounded-sm bg-ink/80 shadow-sm" />

      <section
        className={`hang relative ${tag} rounded-[28px] p-7 pt-9 shadow-[0_18px_40px_-22px_rgba(26,37,71,0.45)]`}
        style={{ ["--tilt" as string]: "-0.6deg" }}
      >
        <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-background ring-1 ring-ink/40" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.24em] text-ink/70">
            {eyebrow}
          </span>
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/70">
            {energyLabel(item.energy)}
          </span>
        </div>

        <h2 className="mt-3 font-display text-[40px] leading-[1.02] tracking-tight text-ink">
          {item.name}
        </h2>
        <p className="mt-2 text-[13px] text-ink/65">
          last tended {timeAgo(item.lastTendedAt)} · every {item.cadenceDays}d
        </p>

        <div className="mt-6">
          <FreshnessBar value={f} size="lg" />
        </div>

        <button
          onClick={() => onTend(item.id)}
          className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-semibold tracking-wide text-background transition-transform active:scale-[0.98]"
        >
          Tend it
        </button>
      </section>
    </div>
  );
}