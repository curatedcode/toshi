import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { type FormEvent, useState, type ChangeEvent } from "react";
import { z } from "zod";
import SimpleLayout from "~/components/SimpleSimple";
import { getServerAuthSession } from "~/server/auth";

function SignInPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [email, setEmail] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { success: emailSuccess } = z
      .string()
      .email()
      .max(64)
      .safeParse(email);
    const { success: emailNotBlank } = z
      .string()
      .min(1)
      .max(64)
      .safeParse(email);
    const { success: passwordSuccess } = z
      .string()
      .min(1)
      .max(1024)
      .safeParse(password);

    if (!emailSuccess || !emailNotBlank) {
      setEmailErrorMessage(
        !emailSuccess ? "Wrong or invalid email address." : "Enter your email."
      );
      setShowEmailError(true);
    }

    if (!passwordSuccess) setShowPasswordError(true);

    if (!emailSuccess || !emailNotBlank || !passwordSuccess) return;

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: true,
    });
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    type: "email" | "pass"
  ) {
    const text = e.currentTarget.value;

    switch (type) {
      case "email":
        setShowEmailError(false);
        setEmail((prev) => (text.length <= 64 ? text : prev));
        break;
      case "pass":
        setShowPasswordError(false);
        setPassword((prev) => (text.length <= 1024 ? text : prev));
        break;
    }
  }

  return (
    <SimpleLayout
      title="Sign in | Toshi"
      description="Sign in to shop on Toshi.com"
      className="mt-16 flex w-full max-w-xs flex-col place-self-center rounded-sm border border-neutral-300 px-6 pb-8 pt-4 md:mt-32"
    >
      <h1 className="mb-2 ml-1 text-2xl font-semibold">Sign in</h1>
      {Object.values(providers).map((provider) => {
        const { id, name } = provider;

        if (name === "Credentials") {
          return (
            <form
              key={id}
              onSubmit={(e) => void handleSignIn(e)}
              className="flex flex-col gap-2"
            >
              <div className="flex flex-col">
                <label htmlFor="email" className="ml-1 font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  maxLength={64}
                  value={email}
                  onChange={(e) => handleInputChange(e, "email")}
                  className={`duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none ${
                    showEmailError ? "border-red-500" : ""
                  }`}
                />
                <div
                  role="alert"
                  className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
                    showEmailError ? "" : "hidden"
                  }`}
                >
                  <span className="text-lg font-semibold">!</span>
                  <span>{emailErrorMessage}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="ml-1 font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="off"
                  maxLength={1024}
                  value={password}
                  onChange={(e) => handleInputChange(e, "pass")}
                  className={`duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none ${
                    showPasswordError ? "border-red-500" : ""
                  }`}
                />
                <div
                  role="alert"
                  className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
                    showPasswordError ? "" : "hidden"
                  }`}
                >
                  <span className="text-lg font-semibold">!</span>
                  <span>Please enter your password.</span>
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 w-full rounded-md bg-toshi-red px-2 py-1 text-lg font-semibold text-white"
              >
                Sign in
              </button>
            </form>
          );
        }
      })}
      <div className="my-4 flex w-full items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
        <p className="mx-4 text-center text-neutral-500">New to Toshi?</p>
      </div>
      <Link
        href={"/auth/sign-up"}
        className="w-full rounded-md bg-neutral-200 px-2 py-1 text-center text-lg font-semibold text-neutral-600 transition-colors hover:bg-neutral-300"
      >
        Create an account
      </Link>
    </SimpleLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}

export default SignInPage;
