/* eslint-disable @typescript-eslint/no-misused-promises */
import type { GetServerSideProps, NextPage } from "next";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import type {
  AvatarFormProps,
  EmailFormProps,
  FormProps,
  NameFormProps,
  PhoneNumberFormProps,
} from "~/customTypes";
import { useQueryClient } from "@tanstack/react-query";
import TextInputField from "~/components/Input/TextInputField";
import {
  avatarColors,
  avatarUrls,
  emailSchema,
  max_email_char,
  max_firstName_char,
  max_lastName_char,
  max_password_char,
  max_phoneNumber_char,
  nameSchema,
  passwordSchemaType,
  phoneSchema,
} from "~/customVariables";
import Avatar from "~/components/Avatar";
import Image from "~/components/Image";
import { type AvatarColor } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";

const SettingsPage: NextPage = () => {
  const { data: settings, refetch, isLoading } = api.user.settings.useQuery();

  const [editAvatar, setEditAvatar] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // warn before exit if any field is active
  useEffect(() => {
    function handleExit(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    if (editName || editEmail || editPhoneNumber || editPassword) {
      window.addEventListener("beforeunload", handleExit);
      return () => window.removeEventListener("beforeunload", handleExit);
    }
  }, [editName, editEmail, editPhoneNumber, editPassword]);

  const placeholder = isLoading ? "" : "Not set";

  const name =
    settings?.firstName && settings.lastName
      ? `${settings?.firstName ?? ""} ${settings?.lastName ?? ""}`
      : placeholder;

  return (
    <Layout
      title="Settings | Toshi"
      description="Edit your account settings on Toshi.com"
      className="flex-row justify-center"
    >
      <div className="mt-12 grid w-full max-w-lg">
        <h1 className="my-3 text-3xl md:text-4xl">Your info</h1>
        <div className="grid divide-y-2 divide-neutral-200 rounded-md border-2 border-neutral-200">
          <div
            className={`flex justify-between px-3 py-2 ${
              editAvatar ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Avatar</h2>
              <Avatar
                alt="Your avatar"
                src={settings?.avatarColor && avatarUrls[settings?.avatarColor]}
                size="lg"
              />
            </div>
            <button
              type="button"
              onClick={() => setEditAvatar(true)}
              title="Edit name"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          {settings?.avatarColor && (
            <AvatarForm
              hidden={!editAvatar}
              setVisible={setEditAvatar}
              initialAvatarColor={settings?.avatarColor}
              refetch={refetch}
            />
          )}
          <div
            className={`flex justify-between px-3 py-2 ${
              editName ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Full Name</h2>
              <span>{name}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditName(true)}
              title="Edit name"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <NameForm
            hidden={!editName}
            setVisible={setEditName}
            initialName={{
              firstName: settings?.firstName,
              lastName: settings?.lastName,
            }}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editEmail ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Email</h2>
              <span>{settings?.email ?? placeholder}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditEmail(true)}
              title="Edit email"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <EmailForm
            hidden={!editEmail}
            setVisible={setEditEmail}
            initialEmail={settings?.email}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editPhoneNumber ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Phone Number</h2>
              <span>{settings?.phoneNumber ?? placeholder}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditPhoneNumber(true)}
              title="Edit phone number"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <PhoneNumberForm
            hidden={!editPhoneNumber}
            setVisible={setEditPhoneNumber}
            initialPhoneNumber={settings?.phoneNumber ?? undefined}
            refetch={refetch}
          />
          <div
            className={`flex justify-between px-3 py-2 ${
              editPassword ? "hidden" : ""
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">Password</h2>
              <span className="">*****</span>
            </div>
            <button
              type="button"
              onClick={() => setEditPassword}
              title="Edit password"
              className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
            >
              Edit
            </button>
          </div>
          <PasswordForm
            hidden={!editPassword}
            setVisible={setEditPassword}
            refetch={refetch}
          />
        </div>
      </div>
    </Layout>
  );
};

export function FormButtons({
  isLoading,
  resetForm,
}: {
  isLoading: boolean;
  resetForm: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={isLoading}
        className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
      >
        {isLoading ? "Saving" : "Save"}
      </button>
      <button
        type="button"
        disabled={isLoading}
        className="h-fit w-20 rounded-md bg-neutral-200 px-2 py-1 transition-colors focus-within:outline-neutral-500 hover:bg-neutral-300"
        onClick={resetForm}
      >
        Cancel
      </button>
    </div>
  );
}

function AvatarForm({
  hidden,
  setVisible,
  initialAvatarColor,
  refetch,
}: AvatarFormProps) {
  const [selectedColor, setSelectedColor] =
    useState<AvatarColor>(initialAvatarColor);

  const { mutate, isLoading } = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (initialAvatarColor === selectedColor) {
      setVisible(false);
      return;
    }
    mutate({ color: selectedColor });
  }

  return (
    <form
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
      onSubmit={onSubmit}
    >
      {avatarColors.map((color, index) => {
        const isSelected = selectedColor === color;

        return (
          <div
            key={index}
            className={`flex flex-col items-center gap-2 rounded-md border border-neutral-200 p-2 ${
              isSelected ? "border-neutral-600" : ""
            }`}
            onClick={() => setSelectedColor(color)}
          >
            <Image alt={`${color} avatar`} src={avatarUrls[color]} />
            <input
              type="radio"
              value={color}
              title={`select ${color} image`}
              onChange={() => setSelectedColor(color)}
              checked={isSelected}
            />
          </div>
        );
      })}
      <FormButtons isLoading={isLoading} resetForm={() => setVisible(false)} />
    </form>
  );
}

function NameForm({ hidden, setVisible, initialName, refetch }: NameFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isLoading } = api.user.updateName.useMutation({
    onSuccess: async () => {
      setVisible(false);
      await queryClient.invalidateQueries({ queryKey: [["user", "fullName"]] });
      refetch();
    },
  });

  const onSubmit = () =>
    mutate({
      firstName: getValues("firstName"),
      lastName: getValues("lastName"),
    });

  const firstNameError = errors.firstName?.message;
  const lastNameError = errors.lastName?.message;

  function resetForm() {
    setVisible(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <TextInputField
          internalLabel="firstName"
          visibleLabel="First Name"
          maxLength={max_firstName_char}
          error={firstNameError}
          defaultValue={initialName?.firstName}
          {...register("firstName")}
        />
        <TextInputField
          internalLabel="lastName"
          visibleLabel="Last Name"
          maxLength={max_lastName_char}
          error={lastNameError}
          defaultValue={initialName?.lastName}
          {...register("lastName")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function EmailForm({
  hidden,
  setVisible,
  initialEmail,
  refetch,
}: EmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const { mutate, isLoading } = api.user.updateEmail.useMutation({
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  const onSubmit = () => mutate({ email: getValues("email") });

  const error = errors.email?.message;

  function resetForm() {
    setVisible(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col">
        <TextInputField
          internalLabel="email"
          visibleLabel="Email"
          maxLength={max_email_char}
          error={error}
          defaultValue={initialEmail}
          {...register("email")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function PhoneNumberForm({
  hidden,
  setVisible,
  initialPhoneNumber,
  refetch,
}: PhoneNumberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  });

  const { mutate, isLoading } = api.user.updatePhoneNumber.useMutation({
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  const onSubmit = () => mutate({ phoneNumber: getValues("phoneNumber") });

  const error = errors.phoneNumber?.message;

  function resetForm() {
    setVisible(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <div className="flex flex-col">
        <TextInputField
          internalLabel="phoneNUmber"
          visibleLabel="Phone Number"
          maxLength={max_phoneNumber_char}
          error={error}
          defaultValue={initialPhoneNumber}
          {...register("phoneNumber")}
        />
      </div>
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

function PasswordForm({ hidden, setVisible, refetch }: FormProps) {
  const password = useRef("");
  const confirmPassword = useRef("");

  const schema = z.object({
    currentPassword: passwordSchemaType,
    password: passwordSchemaType.refine(
      (val) => val === confirmPassword.current,
      {
        message: "Passwords do not match",
      }
    ),
    confirmPassword: passwordSchemaType.refine(
      (val) => val === password.current,
      {
        message: "Passwords do not match",
      }
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = api.user.updatePassword.useMutation({
    onSuccess: () => {
      setVisible(false);
      refetch();
    },
  });

  const onSubmit = () =>
    mutate({
      password: getValues("password"),
      currentPassword: getValues("currentPassword"),
    });

  useEffect(() => {
    password.current = getValues("password");
    confirmPassword.current = getValues("confirmPassword");
  });

  const currentPasswordError = errors.currentPassword?.message;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  function resetForm() {
    setVisible(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex justify-between px-3 py-2 ${hidden ? "hidden" : ""}`}
    >
      <TextInputField
        internalLabel="currentPassword"
        visibleLabel="Current password"
        type="password"
        maxLength={max_password_char}
        error={currentPasswordError}
        {...register("currentPassword")}
      />
      <TextInputField
        internalLabel="password"
        visibleLabel="New password"
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
      <FormButtons isLoading={isLoading} resetForm={resetForm} />
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};

export default SettingsPage;
