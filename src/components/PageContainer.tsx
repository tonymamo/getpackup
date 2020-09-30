import styled from 'styled-components';

import { breakpoints, doubleSpacer, baseSpacer, halfSpacer, quadrupleSpacer } from '../styles/size';

const PageContainer = styled.div`
  margin-right: auto;
  margin-left: auto;
  padding-right: ${halfSpacer};
  padding-left: ${halfSpacer};
  width: 100%;
  max-width: ${breakpoints.xl};
  ${(props: { withVerticalPadding?: boolean }) =>
    props.withVerticalPadding && `margin: ${doubleSpacer} auto;`}

  @media only screen and (min-width: ${breakpoints.sm}) {
    padding-right: ${baseSpacer};
    padding-left: ${baseSpacer};
    ${(props: { withVerticalPadding?: boolean }) =>
      props.withVerticalPadding && `margin: ${quadrupleSpacer} auto;`}
  }
`;

PageContainer.displayName = 'PageContainer';

export default PageContainer;
