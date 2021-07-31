/* eslint-disable no-underscore-dangle */
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as Sentry from '@sentry/gatsby';
// Note: imported 'isomorphic-fetch' this way so that in reducer tests we can mock Fetch/Response
import 'isomorphic-fetch';

import rootReducer, { RootState } from '@redux/ducks/index';
import logger from '@redux/middleware/logger';
import oauth from '@redux/middleware/oauth';
import requestHeaders from '@redux/middleware/requestHeaders';
import errorCatcher from '@redux/middleware/errorCatcher';
import { initialState as clientInitialState } from '@redux/ducks/client';
import { initialState as globalAlertsInitialState } from '@redux/ducks/globalAlerts';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options
});

export const getMiddlewares = () => [oauth, requestHeaders, apiMiddleware, errorCatcher, thunk];

const middlewares = getMiddlewares();
const isBrowser = typeof window !== 'undefined';

// eslint-disable-next-line
if (isBrowser && (window.__ENVIRONMENT || process.env.GATSBY_ENVIRONMENT !== 'PRODUCTION')) {
  middlewares.push(logger);
}

const functionsToCompose = [applyMiddleware(...middlewares), sentryReduxEnhancer];

// eslint-disable-next-line
if (isBrowser && (window.__ENVIRONMENT || process.env.GATSBY_ENVIRONMENT !== 'PRODUCTION')) {
  functionsToCompose.push(
    typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f: any) => f
  );
}

const makeConfiguredStore = (reducer: any, initialState: any) => {
  const persistConfig = {
    key: 'packup',
    storage,
  };
  const persistedReducer = persistReducer(persistConfig, reducer);

  return createStore(persistedReducer, initialState, compose(...functionsToCompose));
};

const configureStore = (
  initialState: string | RootState = {
    client: clientInitialState,
    globalAlerts: globalAlertsInitialState,
  }
) => {
  const store = { ...makeConfiguredStore(rootReducer, initialState) };
  const persistor = persistStore(store);

  return { store, persistor };
};

export default configureStore;
