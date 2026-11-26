/**
 * The studio's own frame. No site header, footer or background: the studio is
 * a workspace and fills the window.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-1 flex-col bg-ground text-ink">{children}</div>;
}
