import {
  WorkerUpdateActions,
  SHOW_UPDATE_MODAL,
  HIDE_UPDATE_MODAL,
  WorkerUpdateStoreType,
} from '@redux/ducks/workerUpdateReady.d';

export const initialState: WorkerUpdateStoreType = {
  display: false,
};

export default (
  state: WorkerUpdateStoreType = initialState,
  action: WorkerUpdateActions
): WorkerUpdateStoreType => {
  switch (action.type) {
    case SHOW_UPDATE_MODAL: {
      return {
        display: true,
      };
    }
    case HIDE_UPDATE_MODAL: {
      return {
        display: false,
      };
    }
    default:
      return state;
  }
};

export const showWorkerUpdateModal = () => ({
  type: SHOW_UPDATE_MODAL,
});

export const hideWorkerUpdateModal = () => ({
  type: HIDE_UPDATE_MODAL,
});
