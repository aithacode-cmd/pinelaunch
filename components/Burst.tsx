/** Six sparkles that fly out once when something is ticked. Decorative. */
export function Burst() {
  return (
    <span className="pl-burst" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <i key={a} style={{ ["--a" as string]: `${a}deg` }} />
      ))}
    </span>
  );
}
