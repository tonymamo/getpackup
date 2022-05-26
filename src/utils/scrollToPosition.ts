import { ScrollTimeout } from './enums';

const scrollToPosition = (offset: number): void => {
  setTimeout(() => {
    window?.scrollTo(0, offset);
  }, ScrollTimeout.default);
};

export default scrollToPosition;
