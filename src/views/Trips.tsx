import React, { FunctionComponent, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { FaArrowRight, FaPlusCircle, FaRedo } from 'react-icons/fa';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';

import { Row, Column, Heading, Box, Button, Seo, PageContainer, TripCard } from '@components';
import { RootState } from '@redux/ducks';
import { isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { TripMemberStatus, TripType } from '@common/trip';
import trackEvent from '@utils/trackEvent';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';
import { setActivePackingListFilter, setActivePackingListTab } from '@redux/ducks/client';
import { doubleSpacer } from '@styles/size';

type TripsProps = {} & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: 'trips',
      where: [
        [
          `tripMembers.${auth.uid}.status`,
          'not-in',
          [TripMemberStatus.Declined, TripMemberStatus.Removed],
        ],
      ],
    },
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

  const nonArchivedTrips: TripType[] =
    isLoaded(trips) && Array.isArray(trips) && trips && trips.length > 0
      ? trips.filter((trip: TripType) => trip.archived !== true)
      : [];

  const pendingTrips = nonArchivedTrips
    .filter((trip) => trip.tripMembers[auth.uid]?.status === TripMemberStatus.Pending)
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const inProgressTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid]?.status !== TripMemberStatus.Pending &&
        isBeforeToday(trip.startDate.seconds * 1000) &&
        isAfterToday(trip.endDate.seconds * 1000)
    )
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const upcomingTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid]?.status !== TripMemberStatus.Pending &&
        isAfterToday(trip.startDate.seconds * 1000)
    )
    .sort((a, b) => a.startDate.seconds - b.startDate.seconds);

  const pastTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid]?.status !== TripMemberStatus.Pending &&
        isBeforeToday(trip.endDate.seconds * 1000)
    )
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const renderTrip = (trip: TripType, pending?: boolean) => (
    <TripCard
      trip={trip}
      isPending={pending}
      key={trip.tripId}
      onClick={
        pending
          ? () => null
          : () => {
              navigate(`/app/trips/${trip.tripId}/`);
              trackEvent('Trip Card Link Clicked', { trip });
            }
      }
    />
  );

  useEffect(() => {
    // reset filters and tab for packing list each time All Trips page is visited
    dispatch(setActivePackingListFilter(PackingListFilterOptions.All));
    dispatch(setActivePackingListTab(TabOptions.Personal));
  }, []);

  if (!isLoaded(trips) || !trips) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={`loadingTrip${index}`}>
            <TripCard trip={{} as TripType} />
          </Box>
        ))}
      </>
    );
  }

  if (
    isLoaded(fetchedGearCloset) &&
    fetchedGearCloset.length === 0 &&
    isLoaded(trips) &&
    nonArchivedTrips.length === 0
  ) {
    return (
      <PageContainer>
        <Row>
          <Column md={8} mdOffset={2}>
            <div style={{ textAlign: 'center', margin: doubleSpacer }}>
              <Heading align="center">New here? 🤔</Heading>
              <p>
                For some reason we couldn&apos;t find your gear closet or any trips for you. Do you
                want to try to load your info again, or do you need to set up your acccount?
              </p>
              <Button
                type="button"
                onClick={() => window.location.reload()}
                rightSpacer
                iconLeft={<FaRedo />}
              >
                Refresh
              </Button>
              <Button type="link" to="/app/onboarding" iconLeft={<FaArrowRight />} color="tertiary">
                Set up account
              </Button>
            </div>
          </Column>
        </Row>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Seo title="My Trips" />
      {isLoaded(trips) && isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0 && (
        <Row>
          <Column sm={4}>
            <p>
              <Button
                type="link"
                to="/app/trips/new"
                iconLeft={<FaPlusCircle />}
                block
                onClick={() =>
                  trackEvent('New Trip Button clicked', { location: 'Trips Page Header' })
                }
              >
                New Trip
              </Button>
            </p>
          </Column>
        </Row>
      )}

      {pendingTrips.length > 0 && (
        <>
          <Heading as="h2" altStyle withDecoration>
            Pending Trip Invitations
          </Heading>
          {pendingTrips.map((trip) => renderTrip(trip, true))}
        </>
      )}

      {/* IN PROGRESS */}
      {inProgressTrips.length > 0 && (
        <>
          <Heading as="h2" altStyle withDecoration>
            Trips in Progress
          </Heading>
          {inProgressTrips.map((trip) => renderTrip(trip))}
        </>
      )}

      {/* UPCOMING */}
      {upcomingTrips.length > 0 && (
        <>
          <Heading as="h2" altStyle withDecoration>
            Upcoming Trips
          </Heading>
          {upcomingTrips.map((trip) => renderTrip(trip))}
        </>
      )}

      {/* NO TRIPS AT ALL, BUT HAS GEAR CLOSET */}
      {((isLoaded(trips) && !upcomingTrips) || trips.length === 0) && (
        <Box>
          No upcoming trips planned currently,{' '}
          <Link
            to="/app/trips/new"
            onClick={() =>
              trackEvent('New Trip Button clicked', {
                location: 'Trips Page Create One Now',
              })
            }
          >
            create one now! <FaArrowRight />
          </Link>
        </Box>
      )}

      {/* PAST TRIPS */}
      {pastTrips.length > 0 && (
        <>
          <Heading as="h2" altStyle withDecoration>
            Past Trips
          </Heading>
          {pastTrips.map((trip) => renderTrip(trip))}
        </>
      )}
    </PageContainer>
  );
};

export default Trips;
