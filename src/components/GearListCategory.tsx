import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { CollapsibleBox, GearListItem } from '@components';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';
import { GearItemType } from '@common/gearItem';

type GearListCategoryProps = {
  categoryName: string;
  sortedItems: GearItemType[];
};

const ItemsWrapper = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const GearListCategory: FunctionComponent<GearListCategoryProps> = ({
  categoryName,
  sortedItems,
}) => {
  return (
    <CollapsibleBox key={categoryName} title={categoryName} defaultClosed={false}>
      <ItemsWrapper>
        {sortedItems && sortedItems.length > 0 ? (
          <>
            {sortedItems.map((item) => (
              <GearListItem key={item.id} item={item} />
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div style={{ flex: 1 }} key={`loadingListItem${index}`}>
                <Skeleton
                  count={1}
                  // random widths between 40 and 90%
                  width={`${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`}
                  height={baseAndAHalfSpacer}
                  style={{ margin: halfSpacer }}
                />
              </div>
            ))}
          </>
        )}
      </ItemsWrapper>
    </CollapsibleBox>
  );
};

export default GearListCategory;
