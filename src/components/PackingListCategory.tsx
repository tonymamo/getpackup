import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Box, FlexContainer, Heading, PackingListItem, PackingListAddItem } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';

type PackingListCategoryProps = {
  categoryName: string;
  sortedItems: PackingListItemType[];
  tripId: string;
  collapsible: boolean;
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
  // Replace Box with CollapsibleBox to make these sections collapsible in the future
  return (
    <Box key={categoryName}>
      <FlexContainer justifyContent="space-between">
        <Heading as="h3" altStyle noMargin>
          {categoryName === 'categoryLoading' ? <Skeleton width={200} /> : categoryName}
        </Heading>
      </FlexContainer>
      <div>
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
      </div>
    </Box>
  );
};

export default PackingListCategory;
