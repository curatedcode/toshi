/* eslint-disable @typescript-eslint/no-misused-promises */
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Layout from "~/components/Layout";
import TextAreaInputField from "~/components/Input/TextAreaInputField";
import TextInputField from "~/components/Input/TextInputField";
import { max_email_char, max_message_char } from "~/customVariables";
import { contactFormSchema, max_fullName_char } from "~/customVariables";
import { api } from "~/utils/api";

// add a cool character counter to message like shopify has

const ContactPage: NextPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const { mutate } = api.contact.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const {
    getValues,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
  });

  function onSubmit() {
    mutate({
      fullName: getValues("fullName"),
      email: getValues("email"),
      message: getValues("message"),
    });
  }

  const fullNameError = errors.fullName?.message;
  const emailError = errors.email?.message;
  const messageError = errors.message?.message;

  useEffect(() => {
    if (!submitted) return;
    const resetForm = setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 5000);
    return () => clearTimeout(resetForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  return (
    <Layout
      title="Contact us | Toshi"
      description="Contact support on Toshi.com"
      className="flex flex-col px-5"
    >
      <div className="mt-16 flex w-full max-w-md flex-col self-center rounded-md border border-neutral-300 px-6 pb-6 pt-4">
        <div className={submitted ? "flex flex-col gap-4 py-12" : "hidden"}>
          <div className="flex items-center self-center">
            <CheckCircleIcon className="-ml-7 w-7 text-green-500" aria-hidden />
            <h1 className="ml-1 text-2xl font-semibold">Message submitted</h1>
          </div>
          <p>
            We&apos;ll contact you within 24 hours. Thank you for your patience.
          </p>
        </div>
        <h1
          className={
            submitted ? "hidden" : "ml-1 self-center text-2xl font-semibold"
          }
        >
          Contact Us
        </h1>
        <p className={submitted ? "hidden" : "mb-6 self-center"}>
          Get in touch with Toshi support.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={submitted ? "hidden" : "flex flex-col gap-2"}
        >
          <TextInputField
            internalLabel="fullName"
            visibleLabel="Your name"
            error={fullNameError}
            maxLength={max_fullName_char}
            {...register("fullName")}
          />
          <TextInputField
            internalLabel="email"
            visibleLabel="Your email"
            error={emailError}
            maxLength={max_email_char}
            {...register("email")}
          />
          <TextAreaInputField
            internalLabel="message"
            visibleLabel="Your message"
            error={messageError}
            maxLength={max_message_char}
            {...register("message")}
          />
          <button
            type="submit"
            className="mt-3 w-fit self-end rounded-md bg-toshi-red px-6 py-1 font-semibold text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactPage;
