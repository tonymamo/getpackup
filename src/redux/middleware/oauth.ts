import { RSAA } from 'redux-api-middleware';

export default (store: any) => (next: any) => (action: any) => {
  const returnAction = action;

  // Check if the action is a RSAA middleware action
  // Also make sure it doesn't have the skipOauth property set
  if (!returnAction[RSAA]) {
    return next(action);
  }

  if (returnAction[RSAA] && returnAction[RSAA].skipOauth) {
    const skipOauth = !!returnAction[RSAA].skipOauth;

    // Have to delete skipOauth or move skipOauth out of RSAA object
    delete returnAction[RSAA].skipOauth;

    if (skipOauth) {
      return next(returnAction);
    }
  }

  const state = store.getState();
  returnAction[RSAA].headers = {
    ...returnAction[RSAA].headers,
    Authorization: `Bearer ${state.auth.accessToken}`,
  };

  return next(returnAction);
};
