import Link from "next/link";
import LogoWithText from "./LogoWithText";

function Footer({ bgColor }: { bgColor: "red" | "web-white" }) {
  return (
    <footer
      className={`absolute bottom-0 mt-12 flex w-full flex-col items-center gap-2 bg-toshi-red py-8 text-lg md:gap-4 ${
        bgColor === "red" ? "bg-toshi-red text-white" : "bg-neutral-100"
      }`}
    >
      <LogoWithText />
      <div className="flex flex-col items-center justify-center gap-2 md:ml-9 md:flex-row md:gap-8">
        <Link
          href={"/policies#privacy"}
          className="text-sky-300 underline underline-offset-1 transition-colors hover:text-sky-400"
        >
          Privacy
        </Link>
        <Link
          href={"/policies#termsOfUse"}
          className="text-sky-300 underline underline-offset-1 transition-colors hover:text-sky-400"
        >
          Terms of Use
        </Link>
        <Link
          href={"/contact"}
          className="text-sky-300 underline underline-offset-1 transition-colors hover:text-sky-400"
        >
          Contact Us
        </Link>
      </div>
      <Link
        href={"/attribution"}
        className="text-xs text-neutral-200 underline underline-offset-1"
      >
        Attribution
      </Link>
    </footer>
  );
}

export default Footer;
