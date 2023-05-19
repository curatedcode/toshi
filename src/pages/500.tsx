import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LogoWithText from "~/components/LogoWithText";

const Custom500: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirect = setTimeout(() => void router.replace("/"), 3000);
    return () => clearTimeout(redirect);
  });

  return (
    <>
      <Head>
        <title>Internal error | Toshi</title>
        <meta name="description" content="Internal error on Toshi.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex h-screen flex-col items-center justify-center text-center">
        <div className="mb-2 flex items-center gap-2 text-2xl">
          <span className="border-r border-neutral-500 py-1 pr-3">500</span>
          <LogoWithText color="red" />
        </div>
        <h1>Something is wrong on our end.</h1>
        <p>
          You&apos;ll be redirected to the homepage soon. <br /> Otherwise{" "}
          <Link href={"/"} className="text-sky-600 underline">
            click here
          </Link>
        </p>
      </main>
    </>
  );
};

export default Custom500;
