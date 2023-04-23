import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LogoWithText from "~/components/LogoWithText";

const Custom404: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirect = setTimeout(() => void router.replace("/"), 3000);
    return () => clearTimeout(redirect);
  });

  return (
    <>
      <Head>
        <title>Page not found | 404</title>
        <meta name="description" content="404 error; page not found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex h-screen flex-col items-center justify-center bg-black text-center text-white">
        <div className="mb-6 flex items-center gap-2 text-2xl">
          <span className="border-r pr-3">404</span>
          <LogoWithText color="red" />
        </div>
        <h1>We can&apos;t find that page.</h1>
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

export default Custom404;
