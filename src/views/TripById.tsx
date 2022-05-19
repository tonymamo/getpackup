import { PackingListItemType } from '@common/packingListItem';
import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import { NoTripFound, PageContainer, Seo } from '@components';
import { RouteComponentProps, Router } from '@reach/router';
import { RootState } from '@redux/ducks';
import {
  setActivePackingListFilter,
  setActivePackingListTab,
  setPersonalListScrollPosition,
  setSharedListScrollPosition,
} from '@redux/ducks/client';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';
import trackEvent from '@utils/trackEvent';
import EditPackingListItem from '@views/EditPackingListItem';
import PackingList from '@views/PackingList';
import TripDetails from '@views/TripDetails';
import TripParty from '@views/TripParty';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';

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
  const packingList: PackingListItemType[] = useSelector(
    (state: RootState) => state.firestore.ordered.packingList
  );

  const isTripOwner: boolean =
    activeTripById && activeTripById.length > 0 && activeTripById[0].owner === auth.uid;

  const activeTrip: TripType | undefined =
    (activeTripById &&
      activeTripById.length > 0 &&
      Object.keys(activeTripById[0].tripMembers).some((member) => member === auth.uid)) ||
    isTripOwner
      ? activeTripById[0]
      : undefined;

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
        activeTrip && activeTrip.tripMembers && Object.keys(activeTrip.tripMembers).length > 0
          ? Object.keys(activeTrip.tripMembers)
          : [auth.uid],
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

  useEffect(() => {
    // reset filters, tab, and scroll positions for packing list each time tripId changes
    dispatch(setActivePackingListFilter(PackingListFilterOptions.All));
    dispatch(setActivePackingListTab(TabOptions.Personal));
    dispatch(setPersonalListScrollPosition(0));
    dispatch(setSharedListScrollPosition(0));
    return () => {
      // disconnect listening and remove data from redux store
      // so next trip can fetch without `activeTripById` already being populated with
      // now-stale data
      dispatch({
        type: actionTypes.CLEAR_DATA,
        preserve: {
          data: ['loggedInUser', 'trips', 'users'],
          ordered: ['loggedInUser', 'trips', 'users'],
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
            packingList={packingList || []}
            tripId={props.id}
            trip={activeTrip}
            tripIsLoaded={isLoaded(activeTripById) && (isEmpty(activeTripById) || !activeTrip)}
          />

          <TripDetails path="/details" activeTrip={activeTrip} users={users} />
          <TripParty path="/party" activeTrip={activeTrip} />
          <EditPackingListItem
            path="/checklist/:id"
            tripId={props.id}
            users={users}
            packingList={packingList || []}
            loggedInUserUid={auth.uid}
            activeTrip={activeTrip}
          />
        </Router>
      </PageContainer>

      {isLoaded(activeTripById) && (isEmpty(activeTripById) || !activeTrip) && <NoTripFound />}
    </>
  );
};

export default TripById;
