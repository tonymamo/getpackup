import { TripMemberStatus, TripType } from '@common/trip';
import { Box, Button, Column, Heading, PageContainer, Row, Seo, TripCard } from '@components';
import { RouteComponentProps } from '@reach/router';
import { RootState } from '@redux/ducks';
import { setActivePackingListFilter, setActivePackingListTab } from '@redux/ducks/client';
import { doubleSpacer } from '@styles/size';
import { isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { PackingListFilterOptions, TabOptions } from '@utils/enums';
import trackEvent from '@utils/trackEvent';
import { Link, navigate } from 'gatsby';
import React, { FunctionComponent, useEffect } from 'react';
import { FaArrowRight, FaPlusCircle, FaRedo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

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
    // the following is a somewhat hacky way to load more users in, because sometimes the similar
    // query in TripCard meant some users would be missing sometimes, probably based on order of the
    // api calls being sent out for each tripcard. It will be fixed by having a proper following/follower
    // aka friending model where we would just load all of a user's friends once on load
    {
      collection: 'users',
      where: [
        'uid',
        'in',
        [
          ...new Set([
            ...[
              trips
                ? trips
                    .map((trip) => (trip.tripMembers ? Object.keys(trip.tripMembers) : ''))
                    .flat()
                : [],
            ].flat(),
            auth.uid,
          ]),
        ].slice(0, 9),
      ],
    },
  ]);

  const nonArchivedTrips: TripType[] =
    isLoaded(trips) && Array.isArray(trips) && trips && trips.length > 0
      ? trips.filter((trip: TripType) => trip.archived !== true)
      : [];

  const pendingTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers &&
        trip.tripMembers[auth.uid] &&
        trip.tripMembers[auth.uid].status === TripMemberStatus.Pending
    )
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const inProgressTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers &&
        trip.tripMembers[auth.uid] &&
        trip.tripMembers[auth.uid].status !== TripMemberStatus.Pending &&
        isBeforeToday(trip.startDate.seconds * 1000) &&
        isAfterToday(trip.endDate.seconds * 1000)
    )
    .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const upcomingTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers &&
        trip.tripMembers[auth.uid] &&
        trip.tripMembers[auth.uid].status !== TripMemberStatus.Pending &&
        isAfterToday(trip.startDate.seconds * 1000)
    )
    .sort((a, b) => a.startDate.seconds - b.startDate.seconds);

  const pastTrips = nonArchivedTrips
    .filter(
      (trip) =>
        trip.tripMembers &&
        trip.tripMembers[auth.uid] &&
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
    // isLoaded(fetchedGearCloset) &&
    // fetchedGearCloset.length === 0 &&
    // isLoaded(trips) &&
    // nonArchivedTrips.length === 0
    true
  ) {
    return (
      <PageContainer>
        <Row>
          <Column md={8} mdOffset={2}>
            <div style={{ textAlign: 'center', margin: doubleSpacer }}>
              <Heading align="center">New here? 🤔</Heading>
              <p>
                Looks like you don&apos;t have any gear in your gear closet, or any trips planned
                yet!
              </p>
              <Button type="link" to="/app/onboarding" iconRight={<FaArrowRight />} color="success">
                Let&apos;s Get Started!
              </Button>
              <br />
              <br />
              <br />
              <p>
                <small>
                  Already started your gear closet, but still seeing this? Let&apos;s try to load
                  your data again.
                </small>
              </p>
              <Button
                type="button"
                onClick={() => window.location.reload()}
                color="tertiary"
                iconLeft={<FaRedo />}
              >
                Refresh
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
