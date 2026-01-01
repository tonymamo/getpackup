import configureStore from '@redux/configureStore';
import { initialState as clientInitialState } from '@redux/ducks/client';
import { initialState as globalAlertsInitialState } from '@redux/ducks/globalAlerts';
import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export const initialState = process.env.BROWSER // eslint-disable-next-line no-underscore-dangle
  ? window.__INITIAL_STATE__
  : {
      client: clientInitialState,
      globalAlerts: globalAlertsInitialState,
    };
const { store, persistor } = configureStore(initialState);

const ReduxWrapper: FunctionComponent<{ element: any }> = ({ element }) => (
  <Provider store={store}>
    {typeof window !== 'undefined' ? (
      <PersistGate loading={null} persistor={persistor}>
        {element}
      </PersistGate>
    ) : (
      element
    )}
  </Provider>
);

export default ReduxWrapper;
