import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { navigate, RouteComponentProps } from '@reach/router';
import { FaArrowRight, FaMapMarkerAlt, FaRegCalendar, FaPlusCircle } from 'react-icons/fa';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import TextTruncate from 'react-text-truncate';

import {
  Row,
  Column,
  FlexContainer,
  Avatar,
  Heading,
  Box,
  Button,
  Seo,
  PageContainer,
} from '@components';
import { RootState } from '@redux/ducks';
import { formattedDateRange, isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { UserType } from '@common/user';
import { TripType } from '@common/trip';
import { halfSpacer } from '@styles/size';

type TripsProps = { loggedInUser?: UserType } & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);

  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);

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
    <Box key={trip.tripId} onClick={() => navigate(`/app/trips/${trip.tripId}`)}>
      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
          <Link to={`/app/trips/${trip.tripId}`}>{trip.name}</Link>
        </Heading>
        {/* TODO: show all trip members avatars instead */}
        <Avatar
          src={loggedInUser?.photoURL as string}
          gravatarEmail={loggedInUser?.email as string}
          size="lg"
        />
      </FlexContainer>
      <p style={{ marginBottom: 0 }}>
        <FaRegCalendar style={{ marginRight: halfSpacer }} />
        {formattedDateRange(trip.startDate.seconds * 1000, trip.endDate.seconds * 1000)}
      </p>
      <p>
        <FaMapMarkerAlt style={{ marginRight: halfSpacer }} /> {trip.startingPoint}
      </p>
      <TextTruncate line={1} element="p" truncateText="…" text={trip.description} />
    </Box>
  );

  return (
    <>
      <Seo title="My Trips" />
      <PageContainer>
        <Row>
          <Column sm={4}>
            <p>
              <Button type="link" to="/app/trips/new" iconLeft={<FaPlusCircle />} block>
                New Trip
              </Button>
            </p>
          </Column>
        </Row>
      </PageContainer>

      {Array.isArray(inProgressTrips) && !!inProgressTrips.length && inProgressTrips.length > 0 && (
        <PageContainer>
          <Heading as="h2" altStyle>
            Trips in Progress
          </Heading>
          {inProgressTrips.map((trip) => renderTrip(trip))}
        </PageContainer>
      )}
      <PageContainer>
        <Heading as="h2" altStyle>
          Upcoming
        </Heading>
      </PageContainer>
      {Array.isArray(upcomingTrips) && !!upcomingTrips.length && upcomingTrips.length > 0 ? (
        <PageContainer>{upcomingTrips.map((trip) => renderTrip(trip))}</PageContainer>
      ) : (
        <PageContainer>
          <Box>
            {trips && trips.length === 0 ? (
              <>
                Looks like it&apos;s your first time here,{' '}
                <Link to="/app/trips/new">
                  let&apos;s get started! <FaArrowRight />
                </Link>
              </>
            ) : (
              <>
                No upcoming trips planned currently,{' '}
                <Link to="/app/trips/new">
                  create one now! <FaArrowRight />
                </Link>
              </>
            )}
          </Box>
        </PageContainer>
      )}

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
