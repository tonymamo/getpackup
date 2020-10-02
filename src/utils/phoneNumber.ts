import StringMask from 'string-mask';

const phoneDelimiter = '-';
const phoneMask = '000-000-0000';
const removeTrailingCharIfFound = (str: string, char: string) =>
  str
    .split(char)
    .filter((segment) => segment !== '')
    .join(char);

export const formatPhoneNumberValue = (str: string) => {
  const sanitizedValue = str.replace(/\W/g, ''); // remove any non-number character
  const unmaskedValue = sanitizedValue.split(phoneDelimiter).join('');
  const formatted = StringMask.process(unmaskedValue, phoneMask);
  return removeTrailingCharIfFound(formatted.result, phoneDelimiter);
};

export const reformattedPhoneForCognito = (num: string) => `+${num.replace(/-/g, '')}`;
