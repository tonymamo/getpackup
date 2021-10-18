import { LocalStorage } from '../enums';

export const setScrollPosition = (): void => {
  window?.scrollTo(0, Number(window?.localStorage.getItem(LocalStorage.WindowOffsetTop)));
};