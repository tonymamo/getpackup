export {};

declare global {
  interface Window {
    __ENVIRONMENT: string;
    __REDUX_DEVTOOLS_EXTENSION__: Function;
    __INITIAL_STATE__: string;
  }
}
