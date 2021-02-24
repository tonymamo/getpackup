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
  HorizontalRule,
  StackedAvatars,
} from '@components';
import { RootState } from '@redux/ducks';
import { formattedDate, formattedDateRange, isAfterToday, isBeforeToday } from '@utils/dateUtils';
import { UserType } from '@common/user';
import { TripType } from '@common/trip';
import { halfSpacer } from '@styles/size';

type TripsProps = { loggedInUser?: UserType } & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const users = useSelector((state: RootState) => state.firestore.data.users);

  useFirestoreConnect([
    {
      collection: 'trips',
      where: ['owner', '==', auth.uid],
      populates: [{ child: 'tripMembers', root: 'users' }],
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

  const numberOfAvatarsToShow = 4;

  const renderTrip = (trip: TripType) => (
    <Box key={trip.tripId} onClick={() => navigate(`/app/trips/${trip.tripId}`)}>
      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
          <Link to={`/app/trips/${trip.tripId}/`}>{trip.name}</Link>
        </Heading>
        <StackedAvatars>
          <Avatar
            src={loggedInUser?.photoURL as string}
            gravatarEmail={loggedInUser?.email as string}
            size="sm"
          />
          {// subtract 1 so we can always show at least +2 below
          users &&
            trip.tripMembers.slice(0, numberOfAvatarsToShow - 1).map((tripMember: any) => {
              const matchingUser: UserType = users[tripMember] ? users[tripMember] : undefined;
              if (!matchingUser) return null;
              return (
                <Avatar
                  src={matchingUser?.photoURL as string}
                  gravatarEmail={matchingUser?.email as string}
                  size="sm"
                  key={matchingUser.uid}
                />
              );
            })}
          {users && trip.tripMembers.length > numberOfAvatarsToShow && (
            <Avatar
              // never want to show +1, because then we could have just rendered the photo.
              // Instead, lets add another so its always at least +2
              staticContent={`+${trip.tripMembers.length - numberOfAvatarsToShow + 1}`}
              size="sm"
            />
          )}
        </StackedAvatars>
      </FlexContainer>
      <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
        <FaRegCalendar style={{ marginRight: halfSpacer }} />
        {trip.tripLength === 21
          ? formattedDate(new Date(trip.startDate.seconds * 1000))
          : formattedDateRange(trip.startDate.seconds * 1000, trip.endDate.seconds * 1000)}
      </FlexContainer>
      <HorizontalRule compact />
      <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
        <FaMapMarkerAlt style={{ marginRight: halfSpacer }} /> {trip.startingPoint}
      </FlexContainer>
      <HorizontalRule compact />
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
