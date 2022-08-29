// Add new colors named after their color here,
// and then assign to an abstract variable in the next group
// DO NOT USE THESE IN ANY OTHER FILE BUT THIS ONE!!!
// This allows for super quick rebranding

const submarine = '#BAC3C8';
const riverbed = '#4A555A';
const red = '#7d2600';
// const green = '#37570e';
const green = '#578220';

// Primary
const orange = '#B35900';
const orangeVariant = '#c46200';

// Secondary
const downriver = '#0b2b44';
const downriverVariant = '#0E3757';

// Tertiary
const bismark = '#41688B';
const bismarkVariant = '#6d8fad';

// Brand Color Assignment
// You can add new vars here, but keep the names abstracted.
export const brandPrimary = orange;
export const brandPrimaryHover = orangeVariant;

export const brandSecondary = downriver;
export const brandSecondaryHover = downriverVariant;

export const brandTertiary = bismark;
export const brandTertiaryHover = bismarkVariant;

// Validation Colors
export const brandSuccess = green;
export const brandInfo = brandTertiary;
export const brandDanger = red;
export const brandNotification = '#d10101';

// Grayscale for UI (borders, shadows, etc)
export const black = '#000A19';
export const darkGray = '#3e3e3e';
export const gray = riverbed;
export const lightGray = submarine;
export const lightestGray = '#dbdbdb';
export const offWhite = '#fafafa';
export const white = '#ffffff';

// Typography
export const textColor = riverbed;
export const textColorLight = lightGray;
export const headingsColor = downriver;

// RGB for form focus styling
export const brandPrimaryRGB = '196,98,0';
export const brandSecondaryRGB = '14, 55, 87';
export const brandDangerRGB = '125,38,0';

// Borders
export const borderColor = lightestGray;
// export const borderColor = `var(--color-border)`;

// Loading spinners
export const lightSpinner = '255, 255, 255'; // white
export const darkSpinner = '74, 85, 90'; // riverbed

export const COLORS = {
  text: {
    light: riverbed, // white
    dark: '#CDD3DE', // near-black
  },
  headings: {
    light: headingsColor,
    dark: lightestGray,
  },
  background: {
    light: white, // white
    dark: '#0F2027',
  },
  backgroundAlt: {
    light: offWhite,
    dark: '#1B2B34',
  },
  primary: {
    light: brandPrimary,
    dark: brandPrimary,
  },
  secondary: {
    light: brandSecondary,
    dark: '#051218',
  },
  // Grays, scaling from least-noticeable to most-noticeable
  lightestGray: {
    light: lightestGray,
    dark: '#343d46',
  },
  lightGray: {
    light: lightGray,
    dark: lightGray,
  },
  gray: {
    light: gray,
    dark: gray,
  },
  darkGray: {
    light: darkGray,
    dark: darkGray,
  },
  border: {
    light: lightestGray,
    dark: '#39474F',
  },
};

export const COLOR_MODE_KEY = 'color-mode';
export const INITIAL_COLOR_MODE_CSS_PROP = '--initial-color-mode';
