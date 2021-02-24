import React, { FunctionComponent, useEffect } from 'react';
import { RouteComponentProps, Router, useLocation } from '@reach/router';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { Seo, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import { TripType } from '@common/trip';
import { brandPrimary, white, textColor } from '@styles/color';
import { baseSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import PackingList from '@views/PackingList';
import TripSummary from '@views/TripSummary';
import EditPackingListItem from '@views/EditPackingListItem';

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
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean }) =>
    props.active ? brandPrimary : 'transparent'};
  color: ${(props) => (props.active ? brandPrimary : textColor)};

  & a {
    display: block;
    padding: ${baseSpacer};
  }
`;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );
  const packingList = useSelector((state: RootState) => state.firestore.ordered.packingList);

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
      populates: [{ child: 'tripMembers', root: 'users' }],
    },
    {
      collection: 'trips',
      doc: props.id,
      subcollections: [{ collection: 'packing-list' }],
      storeAs: 'packingList',
      orderBy: ['category', 'asc'],
    },
  ]);

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
          data: ['loggedInUser', 'trips', 'users'],
          ordered: ['loggedInUser', 'trips'],
        },
      });
    };
  }, []);

  if (!props.id) {
    return null;
  }

  return (
    <>
      <Seo title={activeTrip?.name || 'Trip Summary'} />

      <Tabs>
        <Tab active={!pathname.includes('checklist')}>
          <Link to={`/app/trips/${props.id}`}>Summary</Link>
        </Tab>
        <Tab active={pathname.includes('checklist')}>
          <Link to={`/app/trips/${props.id}/checklist`}>Checklist</Link>
        </Tab>
      </Tabs>
      <PageContainer>
        <Router basepath={`/app/trips/${props.id}`} style={{ paddingTop: 54 }} primary={false}>
          <TripSummary path="/" activeTrip={activeTrip} />
          <PackingList path="/checklist" packingList={packingList} tripId={props.id} />
          <EditPackingListItem path="/checklist/:id" tripId={props.id} />
        </Router>
      </PageContainer>

      {/* TODO: better failure state */}
      {isLoaded(activeTripById) && isEmpty(activeTripById) && <p>No trip found</p>}
    </>
  );
};

export default TripById;
