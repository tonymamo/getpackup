import {
  ADD_ATTEMPTED_PRIVATE_PAGE,
  REMOVE_ATTEMPTED_PRIVATE_PAGE,
  SET_ACTIVE_PACKING_LIST_FILTER,
  SET_ACTIVE_PACKING_LIST_TAB,
  SET_PERSONAL_LIST_SCROLL_POSITION,
  SET_SHARED_LIST_SCROLL_POSITION,
} from '@redux/ducks/client';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';

export type ClientStoreType = {
  location?: string;
  activePackingListFilter: PackingListFilterOptions;
  activePackingListTab: TabOptions;
  personalListScrollPosition: number;
  sharedListScrollPosition: number;
};

export type AddAttemptedPrivatePageAction = {
  type: typeof ADD_ATTEMPTED_PRIVATE_PAGE;
  payload: string;
};

export type RemoveAttemptedPrivatePageAction = {
  type: typeof REMOVE_ATTEMPTED_PRIVATE_PAGE;
};

export type SetActivePackingListFilterAction = {
  type: typeof SET_ACTIVE_PACKING_LIST_FILTER;
  payload: PackingListFilterOptions;
};

export type SetActivePackingListTabAction = {
  type: typeof SET_ACTIVE_PACKING_LIST_TAB;
  payload: TabOptions;
};

export type SetPersonalListScrollPosition = {
  type: typeof SET_PERSONAL_LIST_SCROLL_POSITION;
  payload: number;
};

export type SetSharedListScrollPosition = {
  type: typeof SET_SHARED_LIST_SCROLL_POSITION;
  payload: number;
};

export type ClientActions =
  | AddAttemptedPrivatePageAction
  | RemoveAttemptedPrivatePageAction
  | SetActivePackingListFilterAction
  | SetActivePackingListTabAction
  | SetPersonalListScrollPosition
  | SetSharedListScrollPosition;
