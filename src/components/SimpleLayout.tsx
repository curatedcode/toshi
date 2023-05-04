import Link from "next/link";
import LogoWithText from "./LogoWithText";
import SkipToContentButton from "./SkipToContentButton";
import Head from "next/head";
import type { LayoutProps } from "~/customTypes";
import { Source_Sans_Pro } from "next/font/google";
const font = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
});

function SimpleLayout({
  title,
  description,
  children,
  className = "",
}: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SkipToContentButton />
      <div className="flex justify-center p-2">
        <Link href={"/"} aria-label="Home page" className="w-fit">
          <LogoWithText color="red" />
        </Link>
      </div>
      <main className={`min-h-full ${font.className} ${className}`}>
        {children}
      </main>
      <footer className="absolute bottom-0 flex w-full items-center justify-center bg-neutral-100 py-6">
        FOOTER
      </footer>
    </div>
  );
}

export default SimpleLayout;
