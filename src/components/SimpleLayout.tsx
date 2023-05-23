import Link from "next/link";
import LogoWithText from "./LogoWithText";
import SkipToContentButton from "./SkipToContentButton";
import Head from "next/head";
import type { LayoutProps } from "~/customTypes";
import { Source_Sans_3 } from "next/font/google";
import Footer from "./Footer";
const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  adjustFontFallback: false,
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
      <main
        className={`min-h-full pb-52 font-sans ${font.className} ${className}`}
      >
        {children}
      </main>
      <Footer bgColor="web-white" />
    </div>
  );
}

export default SimpleLayout;
