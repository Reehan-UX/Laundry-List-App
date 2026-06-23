import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AddItemSheet } from "@/components/laundry/AddItemSheet";
import { Clothesline } from "@/components/laundry/Clothesline";
import { EnergyFilter } from "@/components/laundry/EnergyFilter";
import { ItemRow } from "@/components/laundry/ItemRow";
import { useItems } from "@/hooks/use-items";
import { band, freshness, type Energy } from "@/lib/freshness";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Laundry List — what's wilting" },
      {
        name: "description",
        content:
          "A calm, local-first tracker for the life areas that quietly go stale. No streaks, no shame.",
      },
      { property: "og:title", content: "Laundry List" },
      {
        property: "og:description",
        content: "Track what's wilting, not what's undone.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { items, add, tend, remove } = useItems();
  const [energy, setEnergy] = useState<Energy | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const visible = useMemo(() => {
    const filtered = energy === "all" ? items : items.filter((i) => i.energy === energy);
    return [...filtered].sort((a, b) => freshness(a) - freshness(b));
  }, [items, energy]);

  return (
    <main className="paper-grain min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[460px] px-5 pb-36 pt-8">
        <header className="flex items-baseline justify-between">
          <div>
            <p className="font-display text-[26px] leading-none tracking-tight text-ink">
              Laundry List
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ink/55">
              what's wilting today
            </p>
          </div>
          <span className="rounded-sm border border-ink/25 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink/65">
            wash · day
          </span>
        </header>

        <div className="mt-6">
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-ink/55">
            Still on the line
          </p>
          <Clothesline items={visible} onTend={tend} />
        </div>

        <div className="mt-8">
          <EnergyFilter value={energy} onChange={setEnergy} />
        </div>

        {visible.length > 0 ? (
          <>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink/55">
                Everything
              </span>
              <span className="h-px flex-1 bg-ink/15" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink/45">
                {visible.length} item{visible.length === 1 ? "" : "s"}
              </span>
            </div>

            <BentoGrid>
              {visible.map((item, idx) => {
                const b = band(freshness(item));
                const wide = b === "stale" || (idx === 0 && b === "waning");
                const emphasis = wide ? "large" : "small";
                return (
                  <div key={item.id} className={wide ? "col-span-2" : "col-span-1"}>
                    <ItemRow
                      item={item}
                      onTend={tend}
                      onRemove={remove}
                      emphasis={emphasis}
                    />
                  </div>
                );
              })}
            </BentoGrid>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState onAdd={() => setAddOpen(true)} hasAny={items.length > 0} />
          </div>
        )}

        <p className="mt-10 text-center text-[11px] italic text-ink/45">
          laundry is never done — it just cycles.
        </p>
      </div>

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold tracking-wide text-background shadow-[0_12px_30px_-12px_rgba(26,37,71,0.5)] transition-transform active:scale-[0.98]"
        aria-label="Add new item"
      >
        + Peg something up
      </button>

      <AddItemSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={add} />
    </main>
  );
}

function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 grid auto-rows-[minmax(132px,auto)] grid-cols-2 gap-2.5">
      {children}
    </div>
  );
}

function EmptyState({ onAdd, hasAny }: { onAdd: () => void; hasAny: boolean }) {
  return (
    <section className="rounded-3xl border border-dashed border-ink/25 bg-card p-8 text-center">
      <h2 className="font-display text-2xl text-ink">
        {hasAny ? "Nothing matches that energy." : "Nothing to tend yet."}
      </h2>
      <p className="mx-auto mt-2 max-w-[28ch] text-sm text-ink/60">
        {hasAny
          ? "Try a different energy chip above."
          : "Add a life area that quietly goes stale when you ignore it."}
      </p>
      {!hasAny && (
        <button
          onClick={onAdd}
          className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background"
        >
          Hang the first tag
        </button>
      )}
    </section>
  );
}
