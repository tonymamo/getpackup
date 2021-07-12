import React, { FunctionComponent } from 'react';
import { Link, navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { FaArrowRight, FaPlusCircle } from 'react-icons/fa';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import { Row, Column, Heading, Box, Button, Seo, PageContainer, TripCard } from '@components';
import { RootState } from '@redux/ducks';
import { isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { UserType } from '@common/user';
import { TripType } from '@common/trip';
import trackEvent from '@utils/trackEvent';

type TripsProps = { loggedInUser?: UserType } & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);

  useFirestoreConnect([
    {
      collection: 'trips',
      where: ['owner', '==', auth.uid],
      populates: [{ child: 'tripMembers', root: 'users' }],
    },
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

  const inProgressTrips =
    trips &&
    trips.length &&
    trips
      .filter(
        (trip) =>
          isBeforeToday(trip.startDate.seconds * 1000) && isAfterToday(trip.endDate.seconds * 1000)
      )
      .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const upcomingTrips =
    trips &&
    trips.length &&
    trips
      .filter((trip) => isAfterToday(trip.startDate.seconds * 1000))
      .sort((a, b) => a.startDate.seconds - b.startDate.seconds);

  const pastTrips =
    trips &&
    trips.length &&
    trips
      .filter((trip) => isBeforeToday(trip.endDate.seconds * 1000))
      .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const renderTrip = (trip: TripType) => (
    <Box
      key={trip.tripId}
      onClick={() => {
        navigate(`/app/trips/${trip.tripId}/`);
        trackEvent('Trip Card Link Clicked', { trip });
      }}
    >
      <TripCard trip={trip} loggedInUser={loggedInUser} showDescription enableNavigation />
    </Box>
  );

  if (isLoaded(fetchedGearCloset) && fetchedGearCloset.length === 0) {
    navigate('/app/onboarding');
  }

  return (
    <>
      <Seo title="My Trips" />
      {isLoaded(trips) && isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0 && (
        <PageContainer>
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
        </PageContainer>
      )}

      {/* LOADING SKELETON */}
      {!isLoaded(trips) && (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={`loadingTrip${index}`}>
              <TripCard
                trip={undefined}
                loggedInUser={loggedInUser}
                showDescription
                enableNavigation
              />
            </Box>
          ))}
        </>
      )}

      {/* IN PROGRESS */}
      {Array.isArray(inProgressTrips) && !!inProgressTrips.length && inProgressTrips.length > 0 && (
        <PageContainer>
          <Heading as="h2" altStyle>
            Trips in Progress
          </Heading>
          {inProgressTrips.map((trip) => renderTrip(trip))}
        </PageContainer>
      )}

      {/* UPCOMING */}
      {Array.isArray(upcomingTrips) && !!upcomingTrips.length && upcomingTrips.length > 0 && (
        <PageContainer>
          <Heading as="h2" altStyle>
            Upcoming
          </Heading>
          {upcomingTrips.map((trip) => renderTrip(trip))}
        </PageContainer>
      )}

      {/* NO UPCOMING TRIPS */}
      {isLoaded(trips) && !upcomingTrips && (
        <PageContainer>
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
        </PageContainer>
      )}

      {/* PAST TRIPS */}
      {Array.isArray(pastTrips) && !!pastTrips.length && pastTrips.length > 0 && (
        <PageContainer>
          <PageContainer>
            <Heading as="h2" altStyle>
              Past
            </Heading>
          </PageContainer>
          <div>{pastTrips.map((trip) => renderTrip(trip))}</div>
        </PageContainer>
      )}
    </>
  );
};

export default Trips;
