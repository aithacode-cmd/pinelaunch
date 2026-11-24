import { Button } from "@/components/Button";
import { Mono } from "@/components/Mono";
import { SiteChrome } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="pl-shell py-24">
        <Mono className="text-muted">404</Mono>
        <h1 className="mt-3 font-heading text-[34px] font-medium leading-[1.04] tracking-[-0.03em] text-txt lg:text-[46px]">Page not found</h1>
        <p className="mt-3 max-w-[46ch] font-body text-[14.5px] leading-[1.6] text-txt2">That link does not go anywhere.</p>
        <Button to="/" className="mt-8">
          Back to the home page
        </Button>
      </div>
    </SiteChrome>
  );
}
