import React, { FunctionComponent, useEffect } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';

import { Seo, PageContainer, NoTripFound } from '@components';
import { RootState } from '@redux/ducks';
import { TripMember, TripType } from '@common/trip';
import PackingList from '@views/PackingList';
import TripDetails from '@views/TripDetails';
import TripParty from '@views/TripParty';
import EditPackingListItem from '@views/EditPackingListItem';
import { UserType } from '@common/user';
import trackEvent from '@utils/trackEvent';

type TripByIdProps = {
  id?: string;
  loggedInUser: UserType;
} & RouteComponentProps;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users = useSelector((state: RootState) => state.firestore.data.users);
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
      collection: 'users',
      where: [
        'uid',
        'in',
        (activeTripById &&
          activeTripById[0]?.tripMembers?.map((member: TripMember) => member.uid)) || [auth.uid],
      ],
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
    activeTripById &&
    activeTripById.length > 0 &&
    activeTripById[0].tripMembers.some((member: TripMember) => member.uid === auth.uid)
      ? activeTripById[0]
      : undefined;

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
    trackEvent('Trip By Id Had No Id');
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
            tripIsLoaded={isLoaded(activeTripById) && (isEmpty(activeTripById) || !activeTrip)}
          />
          <TripDetails
            path="/details"
            activeTrip={activeTrip}
            users={users}
            loggedInUser={props.loggedInUser}
          />
          <TripParty path="/party" activeTrip={activeTrip} />
          <EditPackingListItem path="/checklist/:id" tripId={props.id} />
        </Router>
      </PageContainer>

      {isLoaded(activeTripById) && (isEmpty(activeTripById) || !activeTrip) && <NoTripFound />}
    </>
  );
};

export default TripById;
