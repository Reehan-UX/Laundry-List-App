import { ENERGIES, type Energy } from "@/lib/freshness";

export function EnergyFilter({
  value,
  onChange,
}: {
  value: Energy | "all";
  onChange: (v: Energy | "all") => void;
}) {
  const opts: { value: Energy | "all"; label: string }[] = [
    { value: "all", label: "All" },
    ...ENERGIES,
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
          className={
              "shrink-0 rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors " +
              (active
                ? "border-ink bg-ink text-background"
                : "border-ink/25 bg-background text-ink/65 hover:text-ink")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}