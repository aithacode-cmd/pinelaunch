import { badges } from "@/content";
import type { BadgeId } from "@/content/types";

export function BadgeList({ earned }: { earned: BadgeId[] }) {
  const set = new Set(earned);
  return (
    <ul className="grid gap-2 sm:grid-cols-2" aria-label="Badges">
      {badges.map((b) => {
        const has = set.has(b.id);
        return (
          <li
            key={b.id}
            className={
              "flex items-start gap-3 rounded-md border p-3 text-sm " +
              (has ? "border-pine-200 bg-pine-50" : "border-line bg-paper text-ink-soft")
            }
          >
            <span
              aria-hidden="true"
              className={
                "mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full " + (has ? "bg-pine-700" : "border border-line")
              }
            />
            <span>
              <span className={"block font-medium " + (has ? "text-pine-800" : "")}>{b.title}</span>
              <span className="block">{b.description}</span>
              <span className="sr-only">{has ? " Earned." : " Not earned yet."}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
