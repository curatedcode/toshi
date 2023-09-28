/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SimpleLayout from "~/components/SimpleLayout";
import TextInputField from "~/components/Input/TextInputField";
import { max_email_char, max_password_char } from "~/customVariables";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSideProps } from "next";
import Button from "~/components/Input/Button";
import CustomLink from "~/components/Input/CustomLink";
import { useState } from "react";
import { useRouter } from "next/router";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .max(max_email_char, {
      message: `Email must not be longer than ${max_email_char} characters`,
    })
    .email({ message: "Email is incorrect or invalid" }),
  password: z
    .string()
    .min(8, { message: "Password must be longer than 8 characters" })
    .max(max_password_char, {
      message: `Password must not be longer than ${max_password_char} characters`,
    }),
});

function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    const authAttempt = await signIn("credentials", {
      email: getValues("email"),
      password: getValues("password"),
      callbackUrl: "/",
      redirect: false,
    });

    if (authAttempt && authAttempt.error) {
      return setIncorrectCredentials(
        "Incorrect email and password combination"
      );
    }

    await router.push("/");
  };

  const [incorrectCredentials, setIncorrectCredentials] = useState<
    string | undefined
  >(undefined);

  const emailError = incorrectCredentials ?? errors.email?.message;
  const passwordError = incorrectCredentials ?? errors.password?.message;

  return (
    <SimpleLayout
      title="Sign in | Toshi"
      description="Sign in to Toshi.com"
      className="flex justify-center"
    >
      <div className="mt-16 flex w-full max-w-xs flex-col rounded-md border border-neutral-300 bg-white px-6 pb-6 pt-4 md:mt-24 lg:mt-32">
        <h1 className="mb-2 ml-1 text-2xl font-semibold">Sign in</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex flex-col gap-4"
        >
          <TextInputField
            internalLabel="email"
            visibleLabel="Email"
            maxLength={max_email_char}
            error={emailError}
            {...register("email")}
          />
          <TextInputField
            internalLabel="password"
            visibleLabel="Password"
            type="password"
            maxLength={max_password_char}
            error={passwordError}
            {...register("password")}
          />
          <Button type="submit" style="toshi" className="mt-3 text-lg">
            Sign in
          </Button>
        </form>
        <div className="mb-4 flex w-full items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 text-center text-neutral-500">New to Toshi?</p>
        </div>
        <CustomLink href={"/auth/sign-up"} className="text-lg">
          Create an account
        </CustomLink>
      </div>
    </SimpleLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default SignInPage;
