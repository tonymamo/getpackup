import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useMeasure } from 'react-use';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';

import { halfSpacer } from '@styles/size';
import { Box, FlexContainer, Heading, IconWrapper } from '@components';

type CollapsibleBoxProps = {
  title: string;
  children: React.ReactNode;
};

const ItemsWrapper = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

// In the future, we could allow the collapsed state to be passed in as a prop. If the state
// is supplied, it's a "controlled" component, otherwise it's "uncontrolled" and we
// continue to manage the state internally.
//
// Docs for controlled and uncontrolled components: https://reactjs.org/docs/forms.html
const CollapsibleBox = ({ title, children }: CollapsibleBoxProps) => {
  const defaultHeight = 0;

  // Manages the collapsed state of the accordion
  const [collapsed, setCollapsed] = useState(false);

  // Gets the height of the element (ref)
  const [ref, { height }] = useMeasure();

  // Animations
  const expand = useSpring({
    height: collapsed ? `${defaultHeight}px` : `${height}px`,
  });

  return (
    <Box>
      <FlexContainer justifyContent="space-between">
        <Heading as="h3" altStyle noMargin>
          {title}
        </Heading>
        <IconWrapper onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronDown /> : <FaChevronUp />}
        </IconWrapper>
      </FlexContainer>
      <animated.div style={{ overflow: 'hidden', ...expand, margin: `0 -${halfSpacer}` }}>
        <ItemsWrapper ref={ref}>{children}</ItemsWrapper>
      </animated.div>
    </Box>
  );
};

export default CollapsibleBox;
