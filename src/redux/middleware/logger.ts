/**
 * Logs all actions and states after they are dispatched.
 * see: http://rackt.github.io/redux/docs/advanced/Middleware.html for more details on using middleware
 */
/* eslint-disable no-console */
export default (store: any) => (next: any) => (action: any) => {
  if (!console.group) {
    return next(action);
  }

  console.groupCollapsed(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
