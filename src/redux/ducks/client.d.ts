import {
  ADD_ATTEMPTED_PRIVATE_PAGE,
  REMOVE_ATTEMPTED_PRIVATE_PAGE,
  SET_ACTIVE_PACKING_LIST_FILTER,
  SET_ACTIVE_PACKING_LIST_TAB,
} from '@redux/ducks/client';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';

export type ClientStoreType = {
  location?: string;
  activePackingListFilter: PackingListFilterOptions;
  activePackingListTab: TabOptions;
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

export type ClientActions =
  | AddAttemptedPrivatePageAction
  | RemoveAttemptedPrivatePageAction
  | SetActivePackingListFilterAction
  | SetActivePackingListTabAction;
