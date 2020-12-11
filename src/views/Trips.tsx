import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { navigate, RouteComponentProps } from '@reach/router';
import { FaArrowRight, FaMapMarkerAlt, FaRegCalendar, FaPlusCircle } from 'react-icons/fa';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import TextTruncate from 'react-text-truncate';

import { Row, Column, FlexContainer, Avatar, Heading, Box, Button, Seo } from '../components';
import { RootState } from '../redux/ducks';
import { formattedDateRange, isAfterToday, isBeforeToday } from '../utils/dateUtils';

type TripsProps = {
  user?: firebase.User;
} & RouteComponentProps;

export type TripType = {
  id: string;
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  timezoneOffset: number;
  created: firebase.firestore.Timestamp;
  tripGeneratorOptions?: {
    accommodations: Array<string>;
    transportation: Array<string>;
    activities: Array<string>;
  };
};

const Trips: FunctionComponent<TripsProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);

  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);

  const inProgressTrips =
    trips &&
    trips.length &&
    trips
      .filter(
        (trip) =>
          isBeforeToday(trip.startDate.seconds * 1000, trip.timezoneOffset) &&
          isAfterToday(trip.endDate.seconds * 1000, trip.timezoneOffset)
      )
      .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const upcomingTrips =
    trips &&
    trips.length &&
    trips
      .filter((trip) => isAfterToday(trip.startDate.seconds * 1000, trip.timezoneOffset))
      .sort((a, b) => a.startDate.seconds - b.startDate.seconds);

  const pastTrips =
    trips &&
    trips.length &&
    trips
      .filter((trip) => isBeforeToday(trip.endDate.seconds * 1000, trip.timezoneOffset))
      .sort((a, b) => b.startDate.seconds - a.startDate.seconds);

  const renderTrip = (trip: TripType) => (
    <Box key={trip.tripId} onClick={() => navigate(`/app/trips/${trip.tripId}`)}>
      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
          <Link to={`/app/trips/${trip.tripId}`}>{trip.name}</Link>
        </Heading>
        <Avatar src={auth.photoURL as string} gravatarEmail={auth.email as string} size="sm" />
      </FlexContainer>
      <p style={{ marginBottom: 0 }}>
        <FaRegCalendar />{' '}
        {formattedDateRange(
          trip.startDate.seconds * 1000,
          trip.endDate.seconds * 1000,
          trip.timezoneOffset
        )}
      </p>
      <p>
        <FaMapMarkerAlt /> {trip.startingPoint}
      </p>
      <TextTruncate line={1} element="p" truncateText="…" text={trip.description} />
    </Box>
  );

  return (
    <>
      <Seo title="My Trips" />
      <Row>
        <Column sm={4}>
          <p>
            <Button type="link" to="/app/trips/new" iconLeft={<FaPlusCircle />} block>
              New Trip
            </Button>
          </p>
        </Column>
      </Row>

      {inProgressTrips && inProgressTrips.length > 0 ? (
        <>
          <Heading as="h2" altStyle>
            Trips in Progress
          </Heading>
          {inProgressTrips.map((trip) => renderTrip(trip))}
        </>
      ) : null}

      <Heading as="h2" altStyle>
        Upcoming
      </Heading>
      {upcomingTrips && upcomingTrips.length > 0 ? (
        <div>{upcomingTrips.map((trip) => renderTrip(trip))}</div>
      ) : (
        <p>
          No upcoming trips,{' '}
          <Link to="/app/trips/new">
            create one now <FaArrowRight />
          </Link>
        </p>
      )}

      <Heading as="h2" altStyle>
        Past
      </Heading>
      {pastTrips && pastTrips.length > 0 ? (
        <div>{pastTrips.map((trip) => renderTrip(trip))}</div>
      ) : (
        <p>No past trips... Time to get out there!</p>
      )}
    </>
  );
};

export default Trips;
