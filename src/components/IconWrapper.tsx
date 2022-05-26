import { brandPrimary, textColor } from '@styles/color';
import { doubleSpacer } from '@styles/size';
import styled from 'styled-components';

const IconWrapper = styled.div<{ color?: string; hoverColor?: string }>`
  cursor: pointer;
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.color ? props.color : textColor)};
  &:hover {
    color: ${(props) => (props.hoverColor ? props.hoverColor : brandPrimary)};
  }
`;

export default IconWrapper;
