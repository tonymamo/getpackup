import { ADD_ATTEMPTED_PRIVATE_PAGE, REMOVE_ATTEMPTED_PRIVATE_PAGE } from './client';

export type ClientStoreType = {
  location?: string;
};

export type AddAttemptedPrivatePageAction = {
  type: typeof ADD_ATTEMPTED_PRIVATE_PAGE;
  payload: string;
};

export type RemoveAttemptedPrivatePageAction = {
  type: typeof REMOVE_ATTEMPTED_PRIVATE_PAGE;
};

export type ClientActions = AddAttemptedPrivatePageAction | RemoveAttemptedPrivatePageAction;
