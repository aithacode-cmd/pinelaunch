import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell kicker="404" title="Page not found" lead="That link does not go anywhere.">
      <Link href="/" className="btn-primary">
        Back to the home page
      </Link>
    </PageShell>
  );
}
