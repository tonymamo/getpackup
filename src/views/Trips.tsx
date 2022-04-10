import React, { FunctionComponent } from 'react';
import { Link, navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { FaArrowRight, FaPlusCircle } from 'react-icons/fa';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import { Row, Column, Heading, Box, Button, Seo, PageContainer, TripCard } from '@components';
import { RootState } from '@redux/ducks';
import { isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { TripMemberStatus, TripType } from '@common/trip';
import trackEvent from '@utils/trackEvent';

type TripsProps = {} & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);

  useFirestoreConnect([
    {
      collection: 'trips',
      where: [[`tripMembers.${auth.uid}.status`, '!=', TripMemberStatus.Declined]],
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
    .filter((trip) => trip.tripMembers[auth.uid].status === TripMemberStatus.Pending)
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const inProgressTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid].status !== TripMemberStatus.Pending &&
        isBeforeToday(trip.startDate.seconds * 1000) &&
        isAfterToday(trip.endDate.seconds * 1000)
    )
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const upcomingTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid].status !== TripMemberStatus.Pending &&
        isAfterToday(trip.startDate.seconds * 1000)
    )
    .sort((a, b) => a.startDate.seconds - b.startDate.seconds);

  const pastTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers[auth.uid].status !== TripMemberStatus.Pending &&
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

  if (
    isLoaded(fetchedGearCloset) &&
    fetchedGearCloset.length === 0 &&
    isLoaded(trips) &&
    nonArchivedTrips.length === 0
  ) {
    navigate('/app/onboarding');
  }

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
