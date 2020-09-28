import { v4 as uuidv4 } from 'uuid';

import { GlobalAlertsStoreType, AlertType, GlobalAlertsActions } from './globalAlerts.d';

export const ADD_GLOBAL_ALERT = 'ADD_GLOBAL_ALERT';
export const CLOSE_GLOBAL_ALERT = 'CLOSE_GLOBAL_ALERT';
export const ADD_GLOBAL_BANNER = 'ADD_GLOBAL_BANNER';
export const CLOSE_GLOBAL_BANNER = 'CLOSE_GLOBAL_BANNER';

export const initialState: GlobalAlertsStoreType = {
  alerts: [],
  currentAlert: null,
  banners: [],
  currentBanner: null,
};

export default (
  state: GlobalAlertsStoreType = initialState,
  action: GlobalAlertsActions
): GlobalAlertsStoreType => {
  switch (action.type) {
    case ADD_GLOBAL_ALERT: {
      // eslint-disable-next-line
      action.payload.id = action.payload.id || uuidv4();
      const alerts = [...state.alerts, action.payload];
      return {
        ...state,
        alerts,
        currentAlert: alerts.length ? alerts[0] : null,
      };
    }
    case CLOSE_GLOBAL_ALERT: {
      const index = state.alerts.findIndex((x: any) => x.id === action.payload.id);
      const alerts = [...state.alerts.slice(0, index), ...state.alerts.slice(index + 1)];

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        alerts,
        currentAlert: alerts.length ? alerts[0] : null,
      };
    }
    case ADD_GLOBAL_BANNER: {
      // eslint-disable-next-line
      action.payload.id = action.payload.id || uuidv4();
      const banners = [...state.banners, action.payload];
      return {
        ...state,
        banners,
        currentBanner: banners.length ? banners[0] : null,
      };
    }
    case CLOSE_GLOBAL_BANNER: {
      const index = state.banners.findIndex((x: any) => x.id === action.payload.id);
      const banners = [...state.banners.slice(0, index), ...state.banners.slice(index + 1)];

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        banners,
        currentBanner: banners.length ? banners[0] : null,
      };
    }
    default:
      return state;
  }
};

export const addAlert = (payload: AlertType) => ({ type: ADD_GLOBAL_ALERT, payload });

export const closeAlert = (payload: AlertType) => ({
  type: CLOSE_GLOBAL_ALERT,
  payload,
});

export const addBanner = (payload: AlertType) => ({ type: ADD_GLOBAL_BANNER, payload });

export const closeBanner = (payload: AlertType) => ({
  type: CLOSE_GLOBAL_BANNER,
  payload,
});
