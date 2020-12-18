import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from '@redux/configureStore';
import { initialState as globalAlertsInitialState } from '@redux/ducks/globalAlerts';

export const initialState = process.env.BROWSER // eslint-disable-next-line no-underscore-dangle
  ? window.__INITIAL_STATE__
  : {
      globalAlerts: globalAlertsInitialState,
    };
const { store, persistor } = configureStore(initialState);

const ReduxWrapper: FunctionComponent<{ element: any }> = ({ element }) => (
  <Provider store={store}>
    {process.env.BROWSER ? (
      <PersistGate loading={null} persistor={persistor}>
        {element}
      </PersistGate>
    ) : (
      element
    )}
  </Provider>
);

export default ReduxWrapper;
