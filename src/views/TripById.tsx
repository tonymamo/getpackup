import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import styled from 'styled-components';

import { Seo, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import { TripType } from '@common/trip';
import { brandPrimary, white, textColor } from '@styles/color';
import { baseSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import PackingList from '@views/PackingList';
import TripSummary from '@views/TripSummary';
import EditPackingListItem from '@views/EditPackingListItem';
import { PackingListItemType } from '@common/packingListItem';

type TripByIdProps = {
  id?: string;
} & RouteComponentProps;

const Tabs = styled.div`
  margin-top: calc(-${baseSpacer} - 1px);
  background-color: ${white};
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
`;

const Tab = styled.div`
  transition: all 0.2s ease-in-out;
  flex: 1;
  text-align: center;
  padding: ${baseSpacer};
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean; onClick: () => void }) =>
    props.active ? brandPrimary : 'transparent'};
  color: ${(props) => (props.active ? brandPrimary : textColor)};
`;

const SwipeableViewInner = styled.div`
  padding-top: 54px;
`;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const dispatch = useDispatch();

  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );
  const packingList = useSelector((state: RootState) => state.firestore.ordered.packingList);

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
    {
      collection: 'trips',
      doc: props.id,
      subcollections: [{ collection: 'packing-list' }],
      storeAs: 'packingList',
      orderBy: ['category', 'asc'],
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [activePackingListItem, setActivePackingListItem] = useState<
    PackingListItemType | undefined
  >(undefined);

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  useEffect(() => {
    return () => {
      // disconnect listening and remove data from redux store
      // so next trip can fetch without `activeTripById` already being populated with
      // now-stale data
      dispatch({
        type: actionTypes.CLEAR_DATA,
        preserve: {
          data: ['loggedInUser', 'trips'],
          ordered: ['loggedInUser', 'trips'],
        },
      });
    };
  }, []);

  const VirtualizeSwipeableViews = virtualize(SwipeableViews);

  const slideRenderer = ({ key, index }: { key: any; index: number }) => {
    if (index === 0) {
      return (
        <SwipeableViewInner key={key}>
          <PageContainer>
            <TripSummary activeTrip={activeTrip} />
          </PageContainer>
        </SwipeableViewInner>
      );
    }
    if (index === 1) {
      return (
        <SwipeableViewInner key={key}>
          <PageContainer>
            <PackingList
              tripId={props.id as string}
              packingList={packingList}
              editPackingItemClick={() => setActiveTab(2)}
              setActivePackingListItem={setActivePackingListItem}
            />
          </PageContainer>
        </SwipeableViewInner>
      );
    }

    if (index === 2) {
      return (
        <SwipeableViewInner key={key}>
          <PageContainer>
            <EditPackingListItem
              tripId={props.id as string}
              backToPackingListClick={() => setActiveTab(1)}
              activeItem={activePackingListItem}
              setActivePackingListItem={() => setActivePackingListItem(undefined)}
            />
          </PageContainer>
        </SwipeableViewInner>
      );
    }
    return null;
  };

  return (
    <>
      <Seo title={activeTrip?.name || 'Trip Summary'} />

      <Tabs>
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Summary
        </Tab>
        <Tab active={activeTab === 1 || activeTab === 2} onClick={() => setActiveTab(1)}>
          Checklist
        </Tab>
      </Tabs>

      <VirtualizeSwipeableViews
        slideRenderer={slideRenderer}
        index={activeTab}
        onChangeIndex={(index: number, indexLatest: number) => {
          setActiveTab(index);
          // remove Edit Page from view after leaving it by setting state to undefined
          // which affects the slideCount below
          if (indexLatest === 2) {
            setActivePackingListItem(undefined);
          }
        }}
        animateHeight
        slideCount={activePackingListItem ? 3 : 2}
      />

      {/* TODO: better failure state */}
      {isLoaded(activeTripById) && isEmpty(activeTripById) && <p>No trip found</p>}
    </>
  );
};

export default TripById;
