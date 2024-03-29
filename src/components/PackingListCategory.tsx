import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import { CollapsibleBox, FlexContainer, PackingListAddItem, PackingListItem } from '@components';
import { baseAndAHalfSpacer, halfSpacer } from '@styles/size';
import pluralize from '@utils/pluralize';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { FirebaseReducer, useFirebase } from 'react-redux-firebase';
import styled from 'styled-components';

type PackingListCategoryProps = {
  categoryName: string;
  sortedItems: PackingListItemType[];
  isSharedPackingListCategory: boolean;
  tripId: string;
  trip?: TripType;
  auth?: FirebaseReducer.AuthState;
  isSharedTrip?: boolean;
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
  isSharedPackingListCategory,
  auth,
  isSharedTrip,
}) => {
  const firebase = useFirebase();

  const handleCollapsible = (name: string) => {
    if (auth && auth.uid && trip) {
      // updatedCollapsedCategories is not the same shape as collapsedCategories,
      // it is just the array that we will push to the collapsedCategories[auth.uid]
      let updatedCollapsedCategories: string[] = [];

      // Category is in the collapsedList for the current user, so we remove it
      if (
        trip.collapsedCategories &&
        trip.collapsedCategories[auth.uid] &&
        trip.collapsedCategories[auth.uid].some((cat) => cat === name)
      ) {
        updatedCollapsedCategories = trip.collapsedCategories[auth.uid].filter(
          (cat) => cat !== name
        );
      }
      // Category is not in the collapsedlist for current user, so we add it
      else if (
        trip.collapsedCategories &&
        trip.collapsedCategories[auth.uid] &&
        trip.collapsedCategories[auth.uid].findIndex((cat) => cat === name) < 0
      ) {
        updatedCollapsedCategories = [...trip.collapsedCategories[auth.uid], name];
      }
      // user or trip doesnt have any entries in trip.collapsedCategories yet,
      // so lets start an array with the new category and we will add it on doc.update below
      else {
        updatedCollapsedCategories = [name];
      }

      firebase
        .firestore()
        .collection('trips')
        .doc(trip?.tripId)
        .update({
          [`collapsedCategories.${auth.uid}`]: updatedCollapsedCategories,
        })
        .then(() => {
          trackEvent('Collapsed Categories Updated', {
            tripId,
            [`collapsedCategories.${auth.uid}`]: updatedCollapsedCategories,
          });
        })
        .catch(() => {
          trackEvent('Collapsed Categories Update Failure', {
            tripId,
            [`collapsedCategories.${auth.uid}`]: updatedCollapsedCategories,
          });
        });
    }
  };

  return (
    <CollapsibleBox
      key={
        isSharedPackingListCategory
          ? `${categoryName}-CollapsibleBox-Shared`
          : `${categoryName}-CollapsibleBox-Personal`
      }
      title={categoryName}
      subtitle={pluralize('item', sortedItems.length)}
      defaultClosed={
        auth && auth.uid && trip && trip.collapsedCategories && trip.collapsedCategories[auth.uid]
          ? trip.collapsedCategories[auth.uid].findIndex((cat) => cat === categoryName) > -1 &&
            !isSharedPackingListCategory
          : false
      }
      collapseCallback={() => handleCollapsible(categoryName)}
      enabled={!isSharedPackingListCategory}
    >
      <div>
        <ItemsWrapper>
          {sortedItems && sortedItems.length > 0 ? (
            <>
              {sortedItems.map((item) => (
                <PackingListItem
                  key={item.id}
                  tripId={tripId}
                  item={item}
                  isOnSharedList={isSharedPackingListCategory}
                  isSharedTrip={isSharedTrip}
                />
              ))}
              <PackingListAddItem
                tripId={tripId}
                categoryName={categoryName}
                isOnSharedList={isSharedPackingListCategory}
              />
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
