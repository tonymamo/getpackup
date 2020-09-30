import { ClientStoreType, ClientActions } from './client.d';

export const ADD_ATTEMPTED_PRIVATE_PAGE = 'ADD_ATTEMPTED_PRIVATE_PAGE';
export const REMOVE_ATTEMPTED_PRIVATE_PAGE = 'REMOVE_ATTEMPTED_PRIVATE_PAGE';

export const initialState: ClientStoreType = {
  location: undefined,
};

export default (state: ClientStoreType = initialState, action: ClientActions): ClientStoreType => {
  switch (action.type) {
    case ADD_ATTEMPTED_PRIVATE_PAGE: {
      return {
        location: action.payload,
      };
    }
    case REMOVE_ATTEMPTED_PRIVATE_PAGE: {
      return {
        location: undefined,
      };
    }
    default:
      return state;
  }
};

export const addAttemptedPrivatePage = (payload: string) => ({
  type: ADD_ATTEMPTED_PRIVATE_PAGE,
  payload,
});

export const removeAttemptedPrivatePage = () => ({
  type: REMOVE_ATTEMPTED_PRIVATE_PAGE,
});
