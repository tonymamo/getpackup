import React, { FunctionComponent, useEffect } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';

import { Seo, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import { TripType } from '@common/trip';
import PackingList from '@views/PackingList';
import TripSummary from '@views/TripSummary';
import EditPackingListItem from '@views/EditPackingListItem';
import EditTripSummary from '@views/EditTripSummary';
import { UserType } from '@common/user';

type TripByIdProps = {
  id?: string;
  loggedInUser: UserType;
} & RouteComponentProps;

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

  if (!activeTrip || !props.id) {
    return null;
  }

  return (
    <>
      <Seo title={activeTrip?.name || 'Trip Summary'} />

      <PageContainer>
        <Router basepath={`/app/trips/${props.id}`} primary={false}>
          <PackingList
            path="/"
            packingList={packingList}
            tripId={props.id}
            trip={activeTrip}
            loggedInUser={props.loggedInUser}
          />
          <TripSummary path="/summary" activeTrip={activeTrip} />
          <EditTripSummary path="/summary/edit" activeTrip={activeTrip} />
          <EditPackingListItem path="/checklist/:id" tripId={props.id} />
        </Router>
      </PageContainer>

      {/* TODO: better failure state */}
      {isLoaded(activeTripById) && isEmpty(activeTripById) && <p>No trip found</p>}
    </>
  );
};

export default TripById;
