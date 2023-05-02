import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import { type FormEvent, useState, type ChangeEvent } from "react";
import { z } from "zod";
import InternalLink from "~/components/InternalLink";
import SimpleLayout from "~/components/SimpleSimple";
import { api } from "~/utils/api";

const SignUpPage: NextPage = () => {
  const [name, setName] = useState("");
  const [showNameError, setShowNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPasswordError, setShowConfirmPasswordError] =
    useState(false);

  const [showMatchingPasswordError, setShowMatchingPasswordError] =
    useState(false);

  const { mutateAsync: createUser } = api.user.create.useMutation();

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { success: nameSuccess } = z.string().min(1).safeParse(name);
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
    const { success: confirmPasswordSuccess } = z
      .string()
      .min(1)
      .max(1024)
      .safeParse(confirmPassword);

    const doPasswordsMatch = password === confirmPassword;

    if (!nameSuccess) setShowNameError(true);

    if (!emailSuccess || !emailNotBlank) {
      setEmailErrorMessage(
        !emailSuccess ? "Wrong or invalid email address." : "Enter your email."
      );
      setShowEmailError(true);
    }

    if (!passwordSuccess) setShowPasswordError(true);

    if (!confirmPasswordSuccess) setShowConfirmPasswordError(true);

    if (passwordSuccess && confirmPasswordSuccess && !doPasswordsMatch) {
      setShowMatchingPasswordError(true);
    }

    if (
      !nameSuccess ||
      !emailSuccess ||
      !emailNotBlank ||
      !passwordSuccess ||
      !confirmPasswordSuccess ||
      !doPasswordsMatch
    )
      return;

    await createUser({ email, password });

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: true,
    });
  }

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement>,
    type: "name" | "email" | "pass" | "confirmPass"
  ) {
    const text = e.currentTarget.value;

    switch (type) {
      case "name":
        setShowNameError(false);
        setName((prev) => (text.length <= 50 ? text : prev));
        break;
      case "email":
        setShowEmailError(false);
        setEmail((prev) => (text.length <= 64 ? text : prev));
        break;
      case "pass":
        setShowPasswordError(false);
        setShowMatchingPasswordError(false);
        setPassword((prev) => (text.length <= 1024 ? text : prev));
        break;
      case "confirmPass":
        setShowConfirmPasswordError(false);
        setShowMatchingPasswordError(false);
        setConfirmPassword((prev) => (text.length <= 1024 ? text : prev));
        break;
    }
  }

  return (
    <SimpleLayout
      title="Create account | Toshi"
      description="Create an account to shop on Toshi.com"
      className="mt-16 flex w-full max-w-xs flex-col place-self-center rounded-sm border border-neutral-300 px-6 pb-6 pt-4 md:mt-32"
    >
      <h1 className="mb-2 ml-1 text-2xl font-semibold">Create an account</h1>
      <form
        onSubmit={(e) => void handleSignUp(e)}
        className="mb-4 flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="ml-1 font-semibold">
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            maxLength={50}
            value={name}
            onChange={(e) => handleInputChange(e, "name")}
            className={`duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none ${
              showNameError ? "border-red-500" : ""
            }`}
          />
          <div
            role="alert"
            className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
              showNameError ? "" : "hidden"
            }`}
          >
            <span className="text-lg font-semibold">!</span>
            <span>Enter you name.</span>
          </div>
        </div>
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
              showPasswordError || showMatchingPasswordError
                ? "border-red-500"
                : ""
            }`}
          />
          <div
            role="alert"
            className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
              showPasswordError || showMatchingPasswordError ? "" : "hidden"
            }`}
          >
            {showPasswordError && (
              <>
                <span className="text-lg font-semibold">!</span>
                <span>Enter your password.</span>
              </>
            )}
            {showMatchingPasswordError && (
              <>
                <span className="text-lg font-semibold">!</span>
                <span>Passwords must match.</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="ml-1 font-semibold">
            Re-enter password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="off"
            maxLength={1024}
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPass")}
            className={`duration-50 rounded-md border-2 bg-neutral-100 px-3 py-1 transition-shadow focus-within:shadow-md focus-within:shadow-neutral-400 focus-within:outline-none ${
              showConfirmPasswordError || showMatchingPasswordError
                ? "border-red-500"
                : ""
            }`}
          />
          <div
            role="alert"
            className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
              showConfirmPasswordError ? "" : "hidden"
            }`}
          >
            <span className="text-lg font-semibold">!</span>
            <span>Enter your password again.</span>
          </div>
          <div
            role="alert"
            className={`ml-1 flex items-center gap-1 text-sm text-red-500 ${
              showMatchingPasswordError ? "" : "hidden"
            }`}
          >
            <span className="text-lg font-semibold">!</span>
            <span>Passwords must match.</span>
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 w-full rounded-md bg-toshi-red px-2 py-1 text-lg font-semibold text-white"
        >
          Create your account
        </button>
      </form>
      <p className="border-t border-neutral-300 pt-2 text-sm">
        By signing up you agree to our{" "}
        <InternalLink href={"/policies/privacy-notice"} className="text-sm">
          Privacy Notice
        </InternalLink>
        .
      </p>
    </SimpleLayout>
  );
};

export default SignUpPage;
