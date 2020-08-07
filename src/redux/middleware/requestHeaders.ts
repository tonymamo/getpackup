import { RSAA } from 'redux-api-middleware';

export default (store: any) => (next: any) => (action: any) => {
  const returnAction = action;

  // Check if the action is a RSAA middleware action
  if (!returnAction[RSAA]) {
    return next(action);
  }

  if (returnAction[RSAA].method === 'PUT' || returnAction[RSAA].method === 'POST') {
    returnAction[RSAA].headers = {
      ...returnAction[RSAA].headers,
      'Content-Type': 'application/json',
    };
  }

  return next(returnAction);
};
