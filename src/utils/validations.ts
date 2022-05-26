// Formik doesn't allow multiple validation functions in its Field property `validate`, so
// we compose them using this function below
// from https://medium.com/@hasibsahibzada/formik-composed-field-level-validation-e40d6380b2d7
export const customFieldLevelValidation = (
  value: string | Array<string>,
  validations: Array<Function>
) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const validation of validations) {
    const result = validation(value);
    if (result) {
      return result;
    }
  }
  return null;
};

// individual validations
export const requiredField = (value: string) => {
  if (!value || String(value).trim() === '') {
    return 'This field is required';
  }
  return undefined;
};

export const requiredSelect = (value: Array<string> | string) => {
  // Adding a quick timeout seems to help with validation on Selects, which were showing an error on
  // mobile Safari after selecting a value. Touched was true, value was there, but error was still shown
  // setTimeout(() => {
  // input type select can have multiple values as an array of strings, so check that first
  if (Array.isArray(value) && value.length === 0) {
    return 'This field is required';
  }
  // otherwise, for a single value it is just a string
  if ((value as string) === '') {
    return 'This field is required';
  }
  return undefined;
  // }, 100);
};

export const isPhoneNumber = (value: string) =>
  // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined;

export const isEmail = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const isNumber = (value: string) =>
  // eslint-disable-next-line no-restricted-globals
  value && value !== '' && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const isDecimalNumer = (value: string) =>
  value && !/^(\d+\.?\d*|\.\d+)$/.test(value) ? 'Only numbers and decimal places' : undefined;

export const isAlphaNumeric = (value: string) =>
  value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined;

const allowedSpecialCharacters = '!@#$%^&*()\\-_=+\\[{\\]}|;:\\\\\'",<.>/?`~';
const disallowedCharactersRegex = new RegExp(`[^A-Za-z\\d${allowedSpecialCharacters}]`, 'g');
const validPasswordRegex = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${allowedSpecialCharacters}])[A-Za-z\\d${allowedSpecialCharacters}]{8,}$`
);
export const isValidPassword = (value: string) => {
  // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  // Minimum eight characters
  // one uppercase letter
  // one lowercase letter
  // one number
  // one special character

  // additionally, check if there are invalid characters to give a better error
  if (value && !validPasswordRegex.test(value)) {
    const invalidCharactersInPassword = value.match(disallowedCharactersRegex);
    if (invalidCharactersInPassword) {
      return `Password contains invalid character${
        invalidCharactersInPassword.length > 1 ? 's' : ''
      }: ${invalidCharactersInPassword
        .filter((a, b) => invalidCharactersInPassword.indexOf(a) === b)
        .join('')
        .replace(' ', '(space)')}`;
    }
    return 'Password does not meet the requirements';
  }
  return undefined;
};

export const isDollarAmount = (value: string) => {
  const amountRegex = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
  if (value && !amountRegex.test(value)) {
    return 'Must be a valid dollar amount';
  }
  return undefined;
};

// composed validations for use in Formik Field components
export const requiredEmail = (value: string) =>
  customFieldLevelValidation(value, [requiredField, isEmail]);

export const requiredPhoneNumber = (value: string) =>
  customFieldLevelValidation(value, [requiredField, isPhoneNumber]);

export const requiredPassword = (value: string) =>
  customFieldLevelValidation(value, [requiredField, isValidPassword]);

export const passwordRulesString = `Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and a special character.`;

export const requiredDollarAmount = (value: string) =>
  customFieldLevelValidation(value, [isNumber, isDecimalNumer, isDollarAmount]);
