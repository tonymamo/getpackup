import {
  ADD_GLOBAL_ALERT,
  ADD_GLOBAL_BANNER,
  CLOSE_GLOBAL_ALERT,
  CLOSE_GLOBAL_BANNER,
} from '@redux/ducks/globalAlerts';

export type AlertType = {
  message: string;
  type: 'danger' | 'success' | 'info';
  id?: string;
  dismissable?: boolean;
  callToActionLink?: string;
  callToActionLinkText?: string;
};

export type GlobalAlertsStoreType = {
  alerts: Array<AlertType>;
  currentAlert: AlertType | null;
  banners: Array<AlertType>;
  currentBanner: AlertType | null;
};

export type AddGlobalAlertAction = {
  type: typeof ADD_GLOBAL_ALERT;
  payload: AlertType;
};

export type CloseGlobalAlertAction = {
  type: typeof CLOSE_GLOBAL_ALERT;
  payload: AlertType;
};

export type AddGlobalBannerAction = {
  type: typeof ADD_GLOBAL_BANNER;
  payload: AlertType;
};

export type CloseGlobalBannerAction = {
  type: typeof CLOSE_GLOBAL_BANNER;
  payload: AlertType;
};

export type GlobalAlertsActions =
  | AddGlobalAlertAction
  | CloseGlobalAlertAction
  | AddGlobalBannerAction
  | CloseGlobalBannerAction;
