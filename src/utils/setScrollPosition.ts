import { LocalStorage } from './enums';

const setScrollPosition = (): void => {
  // eslint-disable-next-line no-unused-expressions
  window?.scrollTo(0, Number(window?.localStorage.getItem(LocalStorage.WindowOffsetTop)));
};

export default setScrollPosition;
