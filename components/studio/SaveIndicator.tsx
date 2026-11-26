import type { SaveState } from "@/lib/studio/useProject";

const labels: Record<SaveState, string> = {
  loading: "Opening your project",
  saved: "Saved on this device",
  saving: "Saving",
  error: "Not saved on this device",
};

/**
 * Says where the work is. It never implies a cloud backup: projects live in
 * this browser until the student exports them.
 */
export function SaveIndicator({ state }: { state: SaveState }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-2 font-body text-[12.5px] text-ink-2">
      <span
        aria-hidden="true"
        className={"h-1.5 w-1.5 rounded-full " + (state === "saved" ? "bg-accent" : state === "error" ? "bg-danger" : "bg-ink-3")}
      />
      {labels[state]}
    </span>
  );
}
