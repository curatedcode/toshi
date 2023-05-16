/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InternalLink from "~/components/InternalLink";
import SimpleLayout from "~/components/SimpleLayout";
import TextInputField from "~/components/Input/TextInputField";
import {
  max_email_char,
  max_firstName_char,
  max_lastName_char,
  max_password_char,
} from "~/customVariables";
import { api } from "~/utils/api";

const SignUpPage: NextPage = () => {
  const email = useRef("");
  const confirmEmail = useRef("");

  const password = useRef("");
  const confirmPassword = useRef("");

  const schema = z.object({
    firstName: z
      .string()
      .min(1, { message: "Please enter your first name" })
      .max(max_firstName_char),
    lastName: z
      .string()
      .min(1, { message: "Please enter your last name" })
      .max(max_lastName_char),
    email: z
      .string()
      .min(1, { message: "Please enter your email" })
      .max(max_email_char, {
        message: "Email must not be longer than 64 characters",
      })
      .email({ message: "Email is incorrect or invalid" })
      .refine((val) => confirmEmail.current === val, {
        message: "Emails do not match",
      }),
    confirmEmail: z
      .string()
      .min(1, { message: "Please enter your email" })
      .max(max_email_char, {
        message: "Email must not be longer than 64 characters",
      })
      .email({ message: "Email is incorrect or invalid" })
      .refine((val) => email.current === val, {
        message: "Emails do not match",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be longer than 8 characters" })
      .max(max_password_char, {
        message: "Password must not be longer than 1024 characters",
      })
      .refine((val) => val === confirmPassword.current, {
        message: "Passwords do not match",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be longer than 8 characters" })
      .max(max_password_char, {
        message: "Password must not be longer than 1024 characters",
      })
      .refine((val) => val === password.current, {
        message: "Passwords do not match",
      }),
  });

  const { mutateAsync, isLoading } = api.user.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    const email = getValues("email");
    const password = getValues("password");

    await mutateAsync({
      firstName: getValues("firstName"),
      lastName: getValues("lastName"),
      email,
      password,
    });

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: true,
    });
  }

  useEffect(() => {
    email.current = getValues("email");
    confirmEmail.current = getValues("confirmEmail");
    password.current = getValues("password");
    confirmPassword.current = getValues("confirmPassword");
  });

  const firstNameError = errors.firstName?.message;
  const lastNameError = errors.lastName?.message;
  const emailError = errors.email?.message;
  const confirmEmailError = errors.confirmEmail?.message;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  return (
    <SimpleLayout
      title="Create account | Toshi"
      description="Create an account to shop on Toshi.com"
      className="flex justify-center px-2"
    >
      <div className="mt-16 flex w-full max-w-xs flex-col rounded-sm border border-neutral-300 px-6 pb-6 pt-4">
        <h1 className="mb-2 ml-1 text-2xl font-semibold">Create an account</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex flex-col gap-4"
        >
          <TextInputField
            internalLabel="firstName"
            visibleLabel="First Name"
            maxLength={max_firstName_char}
            error={firstNameError}
            {...register("firstName")}
          />
          <TextInputField
            internalLabel="lastName"
            visibleLabel="Last Name"
            maxLength={max_lastName_char}
            error={lastNameError}
            {...register("lastName")}
          />
          <TextInputField
            internalLabel="email"
            visibleLabel="Email"
            maxLength={max_email_char}
            error={emailError}
            {...register("email")}
          />
          <TextInputField
            internalLabel="confirmEmail"
            visibleLabel="Re-enter Email"
            maxLength={max_email_char}
            error={confirmEmailError}
            {...register("confirmEmail")}
          />
          <TextInputField
            internalLabel="password"
            visibleLabel="Password"
            type="password"
            maxLength={max_password_char}
            error={passwordError}
            {...register("password")}
          />
          <TextInputField
            internalLabel="confirmPassword"
            visibleLabel="Re-enter password"
            type="password"
            maxLength={max_password_char}
            error={confirmPasswordError}
            {...register("confirmPassword")}
          />
          <button
            type="submit"
            disabled={isLoading}
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
      </div>
    </SimpleLayout>
  );
};

export default SignUpPage;
