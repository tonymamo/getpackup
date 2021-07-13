import styled from 'styled-components';
import { doubleSpacer } from '@styles/size';
import { brandPrimary } from '@styles/color';

const IconWrapper = styled.div`
  cursor: pointer;
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: ${brandPrimary};
  }
`;

export default IconWrapper;
