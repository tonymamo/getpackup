import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
// TODO: uncomment when we add collapsible sections
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import { useSpring, animated } from 'react-spring';
// import { useMeasure } from 'react-use';

import {
  Box,
  FlexContainer,
  Heading,
  PackingListItem,
  PackingListAddItem,
  // TODO: uncomment when we add collapsible sections
  // IconWrapper,
} from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';

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
  // TODO: uncomment when we add collapsible sections
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
          {categoryName === 'categoryLoading' ? <Skeleton width={200} /> : categoryName}
        </Heading>
        {/* <IconWrapper onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaChevronDown /> : <FaChevronUp />}
        </IconWrapper> */}
      </FlexContainer>
      {/* <animated.div style={{ overflow: 'hidden', ...expand, margin: `0 -${halfSpacer}` }}> */}
      {/* <ItemsWrapper ref={ref}> */}
      <ItemsWrapper>
        {sortedItems && sortedItems.length > 0 ? (
          <>
            {sortedItems.map((item) => (
              <PackingListItem key={item.id} tripId={tripId} item={item} />
            ))}
            <PackingListAddItem tripId={tripId} categoryName={categoryName} />
          </>
        ) : (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <FlexContainer key={`loadingListItem${index}`}>
                <Skeleton
                  circle
                  width={baseAndAHalfSpacer}
                  height={baseAndAHalfSpacer}
                  style={{ marginRight: halfSpacer }}
                />
                <div style={{ flex: 1 }}>
                  <Skeleton
                    count={1}
                    // random widths between 40 and 90%
                    width={`${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`}
                    height={baseAndAHalfSpacer}
                    style={{ margin: halfSpacer }}
                  />
                </div>
              </FlexContainer>
            ))}
          </>
        )}
      </ItemsWrapper>
      {/* </animated.div> */}
    </Box>
  );
};

export default PackingListCategory;
