import { brandNotification } from '@styles/color';
import { baseSpacer } from '@styles/size';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const NotificationDot = styled.div<{ top: string; right: string }>`
  background: ${brandNotification};
  width: ${baseSpacer};
  height: ${baseSpacer};
  border-radius: ${baseSpacer};
  position: absolute;
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  animation: ${pulse} 2s ease-in-out 1s infinite;
`;

export default NotificationDot;
