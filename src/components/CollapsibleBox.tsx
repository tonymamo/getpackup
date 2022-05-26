import { Box, FlexContainer, Heading, IconWrapper } from '@components';
import React, { FunctionComponent, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useMeasure } from 'react-use';
import styled from 'styled-components';

type CollapsibleBoxProps = {
  title: string;
  subtitle?: string;
  defaultClosed: boolean;
  collapseCallback?: () => void;
  enabled?: boolean;
};

const StyledCollapsed = styled.div<{
  isCollapsed: boolean;
  height: number;
}>`
  transition: max-height 0.165s;
  overflow: hidden;
  max-height: ${({ isCollapsed, height }) => (isCollapsed ? '0px' : `${height}px`)};
`;

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
  collapseCallback,
  enabled = true,
}) => {
  // Manages the collapsed state of the accordion
  const [collapsed, setCollapsed] = useState(enabled === true ? defaultClosed : false);

  // Gets the height of the element (ref)
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  const handleCollapse = () => {
    if (collapseCallback) collapseCallback();
    setCollapsed(!collapsed);
  };

  return (
    <Box>
      <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
        <div
          style={{ cursor: 'pointer' }}
          onClick={handleCollapse}
          role="button"
          onKeyPress={handleCollapse}
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
        {enabled && (
          <IconWrapper
            onClick={handleCollapse}
            onKeyPress={handleCollapse}
            tabIndex={0}
            role="button"
          >
            {collapsed ? <FaCaretUp /> : <FaCaretDown />}
          </IconWrapper>
        )}
      </FlexContainer>
      <StyledCollapsed isCollapsed={collapsed} height={height}>
        <div ref={ref}>{children}</div>
      </StyledCollapsed>
    </Box>
  );
};

export default CollapsibleBox;
