// names
export const max_firstName_char = 25;
export const max_lastName_char = 25;

// emails
export const max_email_char = 64;

// phones
export const max_phoneNumber_char = 100;
export const phone_regex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

// passwords
export const min_password_char = 8;
export const max_password_char = 1024;

// addresses -start
export const max_streetAddress_char = 100;
export const max_city_char = 100;
export const max_state_char = 100;

export const min_zipCode_char = 5;
export const max_zipCode_char = 100;
export const zipCode_regex = /(^\d{5}(?:[\s]?[-\s][\s]?\d{4})?$)/;

export const max_country_char = 100;
// addresses -end

// list title
export const max_list_title_char = 50;

// list description
export const max_list_desc_char = 280;
