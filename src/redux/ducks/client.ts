import { ClientStoreType, ClientActions } from '@redux/ducks/client.d';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';

export const ADD_ATTEMPTED_PRIVATE_PAGE = 'ADD_ATTEMPTED_PRIVATE_PAGE';
export const REMOVE_ATTEMPTED_PRIVATE_PAGE = 'REMOVE_ATTEMPTED_PRIVATE_PAGE';

export const SET_ACTIVE_PACKING_LIST_FILTER = 'SET_ACTIVE_PACKING_LIST_FILTER';
export const SET_ACTIVE_PACKING_LIST_TAB = 'SET_ACTIVE_PACKING_LIST_TAB';

export const SET_PERSONAL_LIST_SCROLL_POSITION = 'SET_PERSONAL_LIST_SCROLL_POSITION';
export const SET_SHARED_LIST_SCROLL_POSITION = 'SET_SHARED_LIST_SCROLL_POSITION';

export const initialState: ClientStoreType = {
  location: undefined,
  activePackingListFilter: PackingListFilterOptions.All,
  activePackingListTab: TabOptions.Personal,
  personalListScrollPosition: 0,
  sharedListScrollPosition: 0,
};

export default (state: ClientStoreType = initialState, action: ClientActions): ClientStoreType => {
  switch (action.type) {
    case ADD_ATTEMPTED_PRIVATE_PAGE: {
      return {
        ...state,
        location: action.payload,
      };
    }
    case REMOVE_ATTEMPTED_PRIVATE_PAGE: {
      return {
        ...state,
        location: undefined,
      };
    }
    case SET_ACTIVE_PACKING_LIST_FILTER: {
      return {
        ...state,
        activePackingListFilter: action.payload,
      };
    }
    case SET_ACTIVE_PACKING_LIST_TAB: {
      return {
        ...state,
        activePackingListTab: action.payload,
      };
    }
    case SET_PERSONAL_LIST_SCROLL_POSITION: {
      return {
        ...state,
        personalListScrollPosition: action.payload,
      };
    }
    case SET_SHARED_LIST_SCROLL_POSITION: {
      return {
        ...state,
        sharedListScrollPosition: action.payload,
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

export const setActivePackingListFilter = (payload: PackingListFilterOptions) => ({
  type: SET_ACTIVE_PACKING_LIST_FILTER,
  payload,
});

export const setActivePackingListTab = (payload: TabOptions) => ({
  type: SET_ACTIVE_PACKING_LIST_TAB,
  payload,
});

export const setPersonalListScrollPosition = (payload: number) => ({
  type: SET_PERSONAL_LIST_SCROLL_POSITION,
  payload,
});

export const setSharedListScrollPosition = (payload: number) => ({
  type: SET_SHARED_LIST_SCROLL_POSITION,
  payload,
});
