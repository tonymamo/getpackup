// https://benfrain.com/how-to-get-the-value-of-phone-notches-environment-variables-env-in-javascript-from-css/

// returns a number value by looking at the :root variables set in cssReset.tsx
// for safe area top, right, bottom, or left
const getSafeAreaInset = (position: '--sat' | '--sar' | '--sab' | '--sal') => {
  if (typeof window !== 'undefined') {
    return Number(
      getComputedStyle(window.document.body)
        .getPropertyValue(position)
        .replace('px', '')
    );
  }
  return 0;
};

export default getSafeAreaInset;
