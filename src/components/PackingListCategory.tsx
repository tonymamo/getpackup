import React, { FunctionComponent, useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useMeasure } from 'react-use';

import {
  Box,
  FlexContainer,
  Heading,
  PackingListItem,
  PackingListAddItem,
  IconWrapper,
} from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { halfSpacer } from '@styles/size';

type PackingListCategoryProps = {
  categoryName: string;
  sortedItems: PackingListItemType[];
  tripId: string;
};

const ItemsWrapper = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const PackingListCategory: FunctionComponent<PackingListCategoryProps> = ({
  categoryName,
  sortedItems,
  tripId,
}) => {
  // const defaultHeight = 0;

  // Manages the collapsed state of the accordion
  // const [collapsed, setCollapsed] = useState(false);

  // The height of the content inside of the accordion
  // const [contentHeight, setContentHeight] = useState(defaultHeight);

  // Gets the height of the element (ref)
  // const [ref, { height }] = useMeasure();

  // Animations
  // const expand = useSpring({
  //   height: collapsed ? `${defaultHeight}px` : `${contentHeight}px`,
  // });

  // useEffect(() => {
  //   // Sets initial height
  //   setContentHeight(height);

  //   // Adds resize event listener
  //   window.addEventListener('resize', () => setContentHeight(height));

  //   // Clean-up
  //   return window.removeEventListener('resize', () => setContentHeight(height));
  // }, [height]);

  return (
    <Box key={categoryName}>
      <FlexContainer justifyContent="space-between">
        <Heading as="h3" altStyle>
          {categoryName}
        </Heading>
        {/* <IconWrapper onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronDown /> : <FaChevronUp />}
        </IconWrapper> */}
      </FlexContainer>
      {/* <animated.div style={{ overflow: 'hidden', ...expand, margin: `0 -${halfSpacer}` }}> */}
      {/* <ItemsWrapper ref={ref}> */}
      <ItemsWrapper>
        {sortedItems.map((item) => (
          <PackingListItem key={item.id} tripId={tripId} item={item} />
        ))}
        <PackingListAddItem tripId={tripId} categoryName={categoryName} />
      </ItemsWrapper>
      {/* </animated.div> */}
    </Box>
  );
};

export default PackingListCategory;
