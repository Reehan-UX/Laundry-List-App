import { useState } from "react";
import { CADENCES, ENERGIES, type Energy } from "@/lib/freshness";

export function AddItemSheet({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (input: { name: string; cadenceDays: number; energy: Energy }) => void;
}) {
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState(3);
  const [energy, setEnergy] = useState<Energy>("admin");

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, cadenceDays: cadence, energy });
    setName("");
    setCadence(3);
    setEnergy("admin");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
        <label className="text-[11px] uppercase tracking-[0.22em] text-ink/55">
          Hang a new tag
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Call mom, water plants, write…"
          className="mt-2 w-full border-0 border-b border-ink/30 bg-transparent pb-2 font-display text-2xl tracking-tight text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
        />

        <div className="mt-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-ink/55">
            Wash cycle
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {CADENCES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCadence(c.value)}
                className={
                  "rounded-sm border px-2 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors " +
                  (cadence === c.value
                    ? "border-ink bg-ink text-background"
                    : "border-ink/25 text-ink/65 hover:text-ink")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-ink/55">
            Energy it needs
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ENERGIES.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEnergy(e.value)}
                className={
                  "rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors " +
                  (energy === e.value
                    ? "border-ink bg-ink text-background"
                    : "border-ink/25 text-ink/65 hover:text-ink")
                }
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm text-ink/55 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-background disabled:opacity-40"
          >
            Hang it up
          </button>
        </div>
      </form>
    </div>
  );
}