import Link from "next/link";
import LogoWithText from "./LogoWithText";

function Footer({ bgColor }: { bgColor?: "primary" | "none" }) {
  if (bgColor === "none") {
    return (
      <footer className="mt-12 flex w-full flex-col items-center gap-2 py-8 text-lg text-neutral-200 md:gap-4">
        <div className="flex flex-col items-center justify-center gap-2 xs:flex-row md:gap-8">
          <Link
            href={"/policies#privacy"}
            className="underline underline-offset-1 transition-colors hover:text-neutral-300"
          >
            Privacy
          </Link>
          <Link
            href={"/policies#termsOfUse"}
            className="underline underline-offset-1 transition-colors hover:text-neutral-300"
          >
            Terms of Use
          </Link>
          <Link
            href={"/contact"}
            className="underline underline-offset-1 transition-colors hover:text-neutral-300"
          >
            Contact Us
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12 flex w-full flex-col items-center gap-2 bg-toshi-primary py-8 text-lg text-white md:gap-4">
      <LogoWithText />
      <div className="flex flex-col items-center justify-center gap-2 xs:ml-9 xs:flex-row md:gap-8">
        <Link
          href={"/policies#privacy"}
          className="text-white underline underline-offset-1 transition-colors hover:text-neutral-200"
        >
          Privacy
        </Link>
        <Link
          href={"/policies#termsOfUse"}
          className="text-white underline underline-offset-1 transition-colors hover:text-neutral-200"
        >
          Terms of Use
        </Link>
        <Link
          href={"/contact"}
          className="text-white underline underline-offset-1 transition-colors hover:text-neutral-200"
        >
          Contact Us
        </Link>
      </div>
      <Link
        href={"/attribution"}
        className="text-xs text-white underline underline-offset-1 transition-colors hover:text-neutral-200"
      >
        Attribution
      </Link>
    </footer>
  );
}

export default Footer;
