import { formEmbedUrl, isPlaceholder } from "@/config/program";

interface Props {
  title: string;
  url: string;
}

/**
 * Embeds a Google Form by iframe with a plain link under it in case the embed fails.
 * When the config still holds a placeholder, it says so instead of showing a broken frame.
 */
export function FormEmbed({ title, url }: Props) {
  const embed = formEmbedUrl(url);

  if (!embed || isPlaceholder(url)) {
    return (
      <div className="card border-dashed text-sm text-ink-soft">
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-1">
          This form is not connected yet. The founder needs to paste its link into the site config.
        </p>
      </div>
    );
  }

  return (
    <div>
      <iframe
        src={embed}
        title={title}
        className="h-[1200px] w-full rounded-lg border border-line bg-paper"
        loading="lazy"
      >
        Loading
      </iframe>
      <p className="mt-2 text-sm text-ink-soft">
        If the form does not load above,{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-pine-700 underline">
          open the {title} in a new tab
        </a>
        .
      </p>
    </div>
  );
}
