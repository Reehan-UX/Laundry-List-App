import { band } from "@/lib/freshness";

/**
 * Wash-cycle bar: dashed track like a stitched seam, filled portion is a
 * solid fabric strip. Fresh = soap blue, waning = sun, stale = faded red.
 */
export function FreshnessBar({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const b = band(value);
  const color =
    b === "fresh" ? "bg-fresh" : b === "waning" ? "bg-waning" : "bg-stale";
  const h = size === "lg" ? "h-2" : size === "sm" ? "h-[5px]" : "h-1.5";
  const pct = Math.max(3, Math.round(value * 100));
  return (
    <div
      className={`relative w-full ${h} rounded-full overflow-hidden`}
      style={{
        backgroundColor: "color-mix(in oklab, var(--ink) 8%, transparent)",
      }}
    >
      <div
        className={`absolute inset-y-0 left-0 ${color} rounded-full transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}