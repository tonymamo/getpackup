// Spacing
// define base spacing unit here, all others will build off that in a scale
export const baseSpacerUnit = 16;

export const quarterSpacer = `${baseSpacerUnit * 0.25}px`;
export const halfSpacer = `${baseSpacerUnit * 0.5}px`;
export const threeQuarterSpacer = `${baseSpacerUnit * 0.75}px`;
export const baseSpacer = `${baseSpacerUnit * 1}px`;
export const baseAndAHalfSpacer = `${baseSpacerUnit * 1.5}px`;
export const doubleSpacer = `${baseSpacerUnit * 2}px`;
export const tripleSpacer = `${baseSpacerUnit * 3}px`;
export const quadrupleSpacer = `${baseSpacerUnit * 4}px`;
export const sextupleSpacer = `${baseSpacerUnit * 6}px`;
export const octupleSpacer = `${baseSpacerUnit * 8}px`;
export const decupleSpacer = `${baseSpacerUnit * 10}px`;

// Borders
export const borderWidth = '1px';

// Radius
export const borderRadius = '3px';
export const borderRadiusCircle = '50%';

// Input Heights
export const inputHeight = `${baseSpacerUnit + baseSpacerUnit + baseSpacerUnit + 2}px`;
export const inputPaddingX = `${baseSpacerUnit * 1}px`;
export const inputPaddingY = `${baseSpacerUnit * 0.5}px`;

// Breakpoints in REM
export const breakpoints = {
  xs: '0rem',
  sm: '32rem',
  md: '48rem',
  lg: '64rem',
  xl: '75rem',
};

// Breakpoints in pixels using above breakpoints
export const screenSizes = {
  small: Number(breakpoints.sm.slice(0, -3)) * 16,
  medium: Number(breakpoints.md.slice(0, -3)) * 16,
  large: Number(breakpoints.lg.slice(0, -3)) * 16,
  xlarge: Number(breakpoints.xl.slice(0, -3)) * 16,
};
