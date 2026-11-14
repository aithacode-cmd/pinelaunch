import { Check } from "lucide-react";
import { badges } from "@/content";
import type { BadgeId } from "@/content/types";

export function BadgeList({ earned }: { earned: BadgeId[] }) {
  const set = new Set(earned);
  return (
    <ul className="grid gap-2" aria-label="Badges">
      {badges.map((b) => {
        const has = set.has(b.id);
        return (
          <li
            key={b.id}
            className={
              "flex items-start gap-3 rounded-[14px] border p-3 text-sm " +
              (has ? "border-pine-deep bg-pine-deep/20" : "border-line bg-transparent")
            }
          >
            <span
              aria-hidden="true"
              className={
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full " +
                (has ? "bg-pine text-bg-deep" : "border border-line-3 text-transparent")
              }
            >
              <Check size={14} strokeWidth={3} />
            </span>
            <span>
              <span className={"block font-semibold " + (has ? "text-text" : "text-text-2")}>{b.title}</span>
              <span className="block text-text-3">{b.description}</span>
              <span className="sr-only">{has ? " Earned." : " Not earned yet."}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
