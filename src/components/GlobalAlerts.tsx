import { RootState } from '@redux/ducks';
import { closeAlert } from '@redux/ducks/globalAlerts';
import { zIndexGlobalAlert } from '@styles/layers';
import { halfSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useTransition } from 'react-spring';
import styled from 'styled-components';

import Alert, { AlertProps } from './Alert';

const GlobalAlertWrapper = styled.div`
  position: fixed;
  overflow: hidden;
  bottom: ${halfSpacer};
  padding-right: ${halfSpacer};
  padding-left: ${halfSpacer};
  right: 0;
  z-index: ${zIndexGlobalAlert};
  width: auto;
  & > div {
    margin-bottom: ${halfSpacer};
  }
`;

const AnimatedAlert = styled(animated(Alert))``;

const GlobalAlerts: FunctionComponent<{}> = () => {
  const alerts = useSelector((state: RootState) => state.globalAlerts.alerts);
  const dispatch = useDispatch();

  const config = {
    tension: 170,
    friction: 26,
    precision: 0.1,
  };

  const transitions = useTransition(alerts, (alert) => alert.id, {
    from: { opacity: 0, right: '-100%', life: '100%' },
    enter: () => async (next: any) => next({ opacity: 1, right: '0%' }),
    leave: () => async (next: any) => {
      await next({ life: '0%' });
      await next({ opacity: 0, right: '-100%' });
    },
    onRest: (alert: AlertProps) => dispatch(closeAlert(alert)),
    config: (_: any, state: string) =>
      state === 'leave' ? [{ duration: 5000 }, config, config] : config,
  });

  return (
    <GlobalAlertWrapper>
      {transitions.map(({ key, item, props: { life, ...style } }) => (
        <AnimatedAlert
          style={style}
          key={key}
          type={item.type}
          message={item.message || 'An error occurred. Please try again.'}
          life={life}
        />
      ))}
    </GlobalAlertWrapper>
  );
};

export default GlobalAlerts;
