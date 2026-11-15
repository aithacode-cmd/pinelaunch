/**
 * The fixed page background: near-black, a faint 72px grid that fades out
 * below the fold, two slow pine-tinted glows, a grain layer and a top hairline.
 * Every movement stops under prefers-reduced-motion (see globals.css).
 */
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-deep">
      <div className="pl-grid-bg pl-fade-edges absolute inset-0 opacity-80" />
      <div className="pl-drift absolute -left-48 -top-64 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(49,95,67,0.34),transparent_66%)] blur-2xl" />
      <div
        className="pl-drift absolute -right-52 top-[36%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(126,168,137,0.16),transparent_68%)] blur-3xl"
        style={{ animationDelay: "-9s" }}
      />
      <div className="pl-hairline absolute inset-x-0 top-0 h-px" />
      <div className="pl-grain absolute inset-0 opacity-[0.055] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-15%,rgba(255,255,255,0.055),transparent_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-linear-to-t from-deep to-transparent" />
    </div>
  );
}
