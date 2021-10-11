import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { FlexContainer, PackingListItem, PackingListAddItem, CollapsibleBox } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';
import { LocalStorage } from '../enums';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStorage = window.localStorage;
      const windowOffsetTop = LocalStorage.WindowOffsetTop;
      if (localStorage.getItem(windowOffsetTop) === null) {
        localStorage.setItem(windowOffsetTop, '0');
      }
    }
  }, [window]);

  const handleCollapseCallback = () => {
    console.log('called')
  };

  return (
    <CollapsibleBox key={categoryName} title={categoryName} collapseCallback={handleCollapseCallback}>
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
    </CollapsibleBox>
  );
};

export default PackingListCategory;
