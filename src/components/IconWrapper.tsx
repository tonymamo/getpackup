import styled from 'styled-components';
import { baseSpacer } from '@styles/size';
import { brandPrimary } from '@styles/color';

const IconWrapper = styled.div`
  /* margin bottom to match Input's margin */
  margin-bottom: ${baseSpacer};
  margin-left: ${baseSpacer};
  cursor: pointer;
  &:hover {
    color: ${brandPrimary};
  }
`;

export default IconWrapper;
