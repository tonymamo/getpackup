import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { FlexContainer, PackingListItem, PackingListAddItem, CollapsibleBox } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';
import { TripType } from '@common/trip';
import { useFirebase } from 'react-redux-firebase';
import trackEvent from '@utils/trackEvent';
import { LocalStorage } from '../enums';

type PackingListCategoryProps = {
  categoryName: string;
  sortedItems: PackingListItemType[];
  tripId: string;
  trip?: TripType;
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
  trip,
}) => {
  const firebase = useFirebase();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { localStorage } = window;
      const windowOffsetTop = LocalStorage.WindowOffsetTop;
      if (localStorage.getItem(windowOffsetTop) === null) {
        localStorage.setItem(windowOffsetTop, '0');
      }
    }
  }, [window]);

  const handleCollapsible = (name: string) => {
    let updatedCollapsedCategories: string[] = [];
    if (trip?.collapsedCategories?.some((cat) => cat === name)) {
      // Category is in the collapsedList, so we remove it
      updatedCollapsedCategories = trip.collapsedCategories.filter((cat) => cat !== name);
    } else if (trip?.collapsedCategories && trip?.collapsedCategories?.length > 0) {
      // Category is not in the collapsedlist, so we add it
      updatedCollapsedCategories = [...((trip?.collapsedCategories as unknown) as string[]), name];
    } else {
      // collapsedList does not exist, so we can create it with this category
      updatedCollapsedCategories.push(name);
    }
    firebase
      .firestore()
      .collection('trips')
      .doc(trip?.tripId)
      .update({
        collapsedCategories: updatedCollapsedCategories,
      })
      .then(() => {
        trackEvent('Trip Details Updated', {
          collapsedCategories: updatedCollapsedCategories,
        });
      })
      .catch((err) => {
        trackEvent('Trip Details Update Failure', {
          collapsedCategories: updatedCollapsedCategories,
        });
      });
  };

  return (
    <CollapsibleBox
      key={categoryName}
      title={categoryName}
      defaultClosed={
        trip?.collapsedCategories
          ? trip.collapsedCategories.some((cat) => cat === categoryName)
          : false
      }
      collapseCallback={() => handleCollapsible(categoryName)}
    >
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
