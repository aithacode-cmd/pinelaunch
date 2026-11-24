import { Button } from "../Button";
import { PineMark } from "../Brand";

/** Shown instead of the studio on screens narrower than a laptop. */
export function SmallScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-start justify-center px-6 py-16">
      <PineMark className="h-8 w-8" />
      <h1 className="mt-6 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">
        PineLaunch works on a computer.
      </h1>
      <p className="mt-4 max-w-[40ch] font-body text-[15px] leading-[1.65] text-txt2">
        Building needs room for your code and a live preview side by side. Open this page on a laptop or desktop, or make this
        window wider.
      </p>
      <Button to="/" variant="outline" className="mt-7">
        Back to the home page
      </Button>
    </div>
  );
}
