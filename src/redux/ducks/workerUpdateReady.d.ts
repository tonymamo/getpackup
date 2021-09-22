export const SHOW_UPDATE_MODAL = 'SHOW_UPDATE_MODAL';
export const HIDE_UPDATE_MODAL = 'HIDE_UPDATE_MODAL';

export type ShowUpdateModal = {
  type: typeof SHOW_UPDATE_MODAL;
};

export type HideUpdateModal = {
  type: typeof HIDE_UPDATE_MODAL;
};

export type WorkerUpdateActions = ShowUpdateModal | HideUpdateModal;
