import { band, energyLabel, freshness, timeAgo, type Item } from "@/lib/freshness";
import { FreshnessBar } from "./FreshnessBar";

export function ItemRow({
  item,
  onTend,
  onRemove,
  emphasis = "normal",
}: {
  item: Item;
  onTend: (id: string) => void;
  onRemove: (id: string) => void;
  emphasis?: "large" | "normal" | "small";
}) {
  const f = freshness(item);
  const b = band(f);

  const tone =
    b === "stale"
      ? "bg-stale-surface border-stale/40 text-ink"
      : b === "waning"
        ? "bg-card border-border text-ink"
        : "bg-card border-border text-ink/85";

  const fade = b === "fresh" ? "opacity-85" : "";
  const pad = emphasis === "large" ? "p-5" : emphasis === "small" ? "p-3.5" : "p-4";
  const titleSize =
    emphasis === "large"
      ? "text-[22px]"
      : emphasis === "small"
        ? "text-[15px]"
        : "text-[17px]";
  return (
    <div
      className={`group relative flex h-full flex-col justify-between rounded-2xl border ${tone} ${pad} ${fade} transition-colors`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-display ${titleSize} leading-[1.05] tracking-tight text-ink`}>
            {item.name}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[10px] text-ink/40 opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-[11px] text-ink/55">{timeAgo(item.lastTendedAt)}</p>
      </div>

      <div className="mt-4">
        <FreshnessBar value={f} size="sm" />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-sm border border-ink/20 bg-background/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-ink/65">
            {energyLabel(item.energy)}
          </span>
          <button
            onClick={() => onTend(item.id)}
            className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold tracking-wide text-background transition-transform active:scale-[0.97]"
          >
            Tend
          </button>
        </div>
      </div>
    </div>
  );
}