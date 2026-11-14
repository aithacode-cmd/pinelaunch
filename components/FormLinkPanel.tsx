import { ClipboardList, ExternalLink } from "lucide-react";
import { isPlaceholder } from "@/config/program";

interface Props {
  title: string;
  body: string;
  url: string;
  buttonLabel?: string;
}

/**
 * Replaces the old iframe embed. A compact panel with one button that opens the
 * configured Google Form in a new tab. When the URL is still a placeholder it
 * says so instead of linking anywhere.
 */
export function FormLinkPanel({ title, body, url, buttonLabel = "Open the check-in form" }: Props) {
  const ready = !isPlaceholder(url);
  return (
    <div className="panel-2 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-surface-3 text-pine-hi ring-1 ring-line-3">
          <ClipboardList size={22} aria-hidden="true" />
        </span>
        <div>
          <h3 className="t-heading text-xl">{title}</h3>
          <p className="mt-1 max-w-[52ch] text-[15px] text-text-2">{body}</p>
          <p className="t-mono mt-2">Google Form. Opens in a new tab.</p>
        </div>
      </div>
      {ready ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
          {buttonLabel}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      ) : (
        <span className="t-mono-lg shrink-0 text-text-3">Form link not set yet</span>
      )}
    </div>
  );
}
