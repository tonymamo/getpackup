import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaLongArrowAltRight,
} from 'react-icons/fa';

import { halfSpacer, baseSpacer, borderRadius, doubleSpacer } from '../styles/size';
import { brandDanger, brandSuccess, white, brandTertiary } from '../styles/color';

export type AlertProps = {
  type: 'success' | 'danger' | 'info';
  callToActionLink?: string;
  callToActionLinkText?: string;
  message: string;
};

const renderColor = (type: AlertProps['type']) => {
  if (type === 'success') {
    return brandSuccess;
  }
  if (type === 'danger') {
    return brandDanger;
  }
  if (type === 'info') {
    return brandTertiary;
  }
  return brandDanger;
};

const renderIcon = (type: AlertProps['type']) => {
  if (type === 'danger') {
    return <FaExclamationCircle />;
  }
  if (type === 'success') {
    return <FaCheckCircle />;
  }
  if (type === 'info') {
    return <FaInfoCircle />;
  }
  return <FaInfoCircle />;
};

const AlertWrapper = styled.div`
  background-color: ${(props: { type: AlertProps['type'] }) =>
    props.type && renderColor(props.type)};
  padding: ${baseSpacer} ${doubleSpacer} ${baseSpacer} ${baseSpacer};
  color: ${white};
  margin-bottom: ${baseSpacer};
  border-radius: ${borderRadius};
  text-align: center;
  position: relative;
  & > p {
    margin-bottom: 0;
  }
`;

const StyledLink = styled.a`
  color: ${white};
  margin-left: ${halfSpacer};
  border-bottom: 1px solid ${white};
  &:hover,
  &:focus {
    color: ${white};
  }
`;

const Alert: FunctionComponent<AlertProps> = (props) => (
  <AlertWrapper type={props.type}>
    {renderIcon(props.type)} {props.message}{' '}
    {props.callToActionLink && (
      <StyledLink href={props.callToActionLink}>
        {props.callToActionLinkText} <FaLongArrowAltRight />
      </StyledLink>
    )}
  </AlertWrapper>
);

export default Alert;
