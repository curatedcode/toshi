import { z } from "zod";

// names
export const max_firstName_char = 25;
export const max_lastName_char = 25;
export const max_fullName_char = max_firstName_char + max_lastName_char;
export const nameSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Please enter your first name" })
    .max(max_firstName_char, {
      message: `First name must not be longer than ${max_firstName_char} characters`,
    }),
  lastName: z
    .string()
    .min(1, { message: "Please enter your last name" })
    .max(max_lastName_char, {
      message: `Last name must not be longer than ${max_lastName_char} characters`,
    }),
});

// emails
export const max_email_char = 64;
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .max(max_email_char, {
      message: "Email must not be longer than 64 characters",
    })
    .email({ message: "Email is incorrect or invalid" }),
});

// phones
export const max_phoneNumber_char = 100;
export const phone_regex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .max(max_phoneNumber_char, {
      message: `Phone number must not be longer than ${max_phoneNumber_char} characters`,
    })
    .regex(phone_regex, {
      message: "Phone number is incorrect or invalid",
    }),
});

// passwords
export const min_password_char = 8;
export const max_password_char = 1024;
export const passwordSchemaType = z
  .string()
  .min(min_password_char, {
    message: `Password must be longer than ${min_password_char} characters`,
  })
  .max(max_password_char, {
    message: `Password must not be longer than ${max_password_char} characters`,
  });

// addresses
export const max_streetAddress_char = 100;
export const max_city_char = 100;
export const max_state_char = 100;
export const min_zipCode_char = 5;
export const max_zipCode_char = 100;
export const zipCode_regex = /(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/;
export const max_country_char = 100;
export const addressSchema = z.object({
  streetAddress: z
    .string()
    .min(1, { message: "Please enter your street address" })
    .max(max_streetAddress_char, {
      message: `Street address must not be longer than ${max_streetAddress_char} characters`,
    }),
  city: z
    .string()
    .min(1, { message: "Please enter your city" })
    .max(max_city_char, {
      message: `City must not be longer than ${max_city_char} characters`,
    }),
  state: z
    .string()
    .min(1, { message: "Please enter your state" })
    .max(max_state_char, {
      message: `State must not be longer than ${max_state_char} characters`,
    }),
  country: z
    .string()
    .min(1, { message: "Please enter your country" })
    .max(max_country_char, {
      message: `Country must not be longer than ${max_country_char} characters`,
    }),
  zipCode: z
    .string()
    .min(min_zipCode_char, {
      message: `ZIP Code must be at least ${min_zipCode_char} digits`,
    })
    .max(max_zipCode_char, {
      message: `ZIP Code must not be longer than ${max_zipCode_char} digits`,
    })
    .regex(zipCode_regex, {
      message: "Zip Code is incorrect or invalid",
    }),
});
export const shippingAddressSchema = addressSchema.merge(nameSchema);

// list title
export const max_list_title_char = 50;

// list description
export const max_list_desc_char = 280;

// cards
export const min_cardNumber_char = 10;
export const max_cardNumber_char = 19;
export const min_securityCode_char = 3;
export const max_securityCode_char = 4;
export const paymentSchema = nameSchema.merge(addressSchema).extend({
  cardNumber: z
    .string()
    .min(min_cardNumber_char, { message: "Please enter your card number" })
    .max(max_cardNumber_char, {
      message: `Card number must not be longer than ${max_cardNumber_char} characters`,
    }),
  securityCode: z
    .string()
    .min(min_securityCode_char, { message: "Please enter your security code" })
    .max(max_securityCode_char, {
      message: `Security code must not be longer than ${max_securityCode_char} digits`,
    }),
});

// contact form
export const max_message_char = 1000;
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Please enter your name" })
    .max(max_fullName_char, {
      message: `Name must not be longer than ${max_fullName_char} characters`,
    }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Email is incorrect or invalid" }),
  message: z
    .string()
    .min(1, { message: "Please enter a message" })
    .max(max_message_char, {
      message: `Message must not be over ${max_message_char} characters`,
    }),
});

// etc.
export const taxPercentage = 0.07;
