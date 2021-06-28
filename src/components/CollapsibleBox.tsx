import React, { FunctionComponent, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useMeasure } from 'react-use';
import { animated, useSpring } from 'react-spring';

import { Box, FlexContainer, Heading, IconWrapper } from '@components';

type CollapsibleBoxProps = {
  title: string;
  subtitle?: string;
  defaultClosed?: boolean;
};

// In the future, we could allow the collapsed state to be passed in as a prop. If the state
// is supplied, it's a "controlled" component, otherwise it's "uncontrolled" and we
// continue to manage the state internally.
//
// Docs for controlled and uncontrolled components: https://reactjs.org/docs/forms.html
const CollapsibleBox: FunctionComponent<CollapsibleBoxProps> = ({
  title,
  subtitle,
  defaultClosed,
  children,
}) => {
  const defaultHeight = 0;

  // Manages the collapsed state of the accordion
  const [collapsed, setCollapsed] = useState(!!defaultClosed);

  // Gets the height of the element (ref)
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  // Animations
  const expand = useSpring({
    height: collapsed ? `${defaultHeight}px` : `${height}px`,
  });

  return (
    <Box>
      <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setCollapsed(!collapsed)}
          role="button"
          onKeyPress={() => setCollapsed(!collapsed)}
          tabIndex={0}
        >
          <Heading as="h3" altStyle noMargin>
            {title}
          </Heading>
          {subtitle && (
            <p style={{ margin: '0 0 8px 0', lineHeight: 1 }}>
              <small>{subtitle}</small>
            </p>
          )}
        </div>
        <IconWrapper
          onClick={() => setCollapsed(!collapsed)}
          onKeyPress={() => setCollapsed(!collapsed)}
          tabIndex={0}
          role="button"
        >
          {collapsed ? <FaCaretDown /> : <FaCaretUp />}
        </IconWrapper>
      </FlexContainer>
      <animated.div style={{ overflow: 'hidden', ...expand }}>
        <div ref={ref}>{children}</div>
      </animated.div>
    </Box>
  );
};

export default CollapsibleBox;
