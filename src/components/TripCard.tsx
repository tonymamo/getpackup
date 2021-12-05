import React, { FunctionComponent } from 'react';
import { FaRegCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';
import { Link } from 'gatsby';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useFirestoreConnect } from 'react-redux-firebase';

import { TripMember, TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Heading,
  StackedAvatars,
  Avatar,
  HorizontalRule,
  FlexContainer,
  NegativeMarginContainer,
  HeroImage,
  NoiseRings,
  StaticMapImage,
  Row,
  Column,
} from '@components';
import { baseSpacer, doubleSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { brandSecondary, lightestGray } from '@styles/color';
import { MAX_TRIP_PARTY_SIZE } from '@common/constants';

type TripCardProps = {
  trip?: TripType;
  loggedInUser?: UserType;
};

const StyledTripWrapper = styled.div`
  cursor: pointer;
`;

const StyledLineItem = styled.div`
  margin-bottom: ${halfSpacer};
`;

const PlaceholderImageWrapper = styled.div`
  height: calc(100vw / 5);
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  & svg {
    width: 100%;
  }
`;

const TripCard: FunctionComponent<TripCardProps> = ({ trip, loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users: Array<UserType> = useSelector((state: RootState) => state.firestore.ordered.users);

  const { isExtraSmallScreen, isSmallScreen } = useWindowSize();
  // Box.tsx adjusts padding at small breakpoint, so use this var to change accordingly
  const negativeSpacingSize = isExtraSmallScreen ? baseSpacer : doubleSpacer;

  useFirestoreConnect([
    {
      collection: 'users',
      where: ['uid', 'in', trip?.tripMembers.map((member) => member.uid) || [auth.uid]],
    },
  ]);

  return (
    <StyledTripWrapper>
      <NegativeMarginContainer
        top={negativeSpacingSize}
        left={negativeSpacingSize}
        right={negativeSpacingSize}
      >
        {trip ? (
          <>
            {/* Aspect ratio is 16/4 or these images, but 5 works better because it isnt 100% full width, it's in a PageContainer with a max width */}
            {trip.headerImage && <HeroImage staticImgSrc={trip.headerImage} aspectRatio={5} />}
            {!trip.headerImage && !!trip.lat && !!trip.lng && (
              <StaticMapImage
                lat={trip.lat}
                lng={trip.lng}
                height="calc(100vw / 5)"
                width="100%"
                zoom={10}
                label={isExtraSmallScreen ? undefined : trip.startingPoint}
              />
            )}
            {!trip.headerImage && !trip.lat && !trip.lng && (
              <PlaceholderImageWrapper backgroundColor={brandSecondary}>
                <NoiseRings height={512} width={2048} seed={trip.name} strokeWidth={4} />
              </PlaceholderImageWrapper>
            )}
          </>
        ) : (
          <PlaceholderImageWrapper backgroundColor={lightestGray} />
        )}
      </NegativeMarginContainer>

      <Row>
        <Column md={8}>
          <FlexContainer justifyContent="flex-start" height="100%">
            <Heading as="h3" altStyle noMargin>
              {trip ? (
                <Link
                  to={`/app/trips/${trip.tripId}/`}
                  onClick={() => trackEvent('Trip Card Heading Link Clicked', { trip })}
                >
                  {trip.name}
                </Link>
              ) : (
                <Skeleton width={200} />
              )}
            </Heading>
          </FlexContainer>
        </Column>
        <Column md={4}>
          <FlexContainer justifyContent={isSmallScreen ? 'flex-start' : 'flex-end'}>
            {trip && trip.tripMembers.length > 0 && (
              <StackedAvatars>
                {users &&
                  trip.tripMembers
                    .slice(
                      0,
                      trip.tripMembers.length === MAX_TRIP_PARTY_SIZE
                        ? MAX_TRIP_PARTY_SIZE
                        : MAX_TRIP_PARTY_SIZE - 1 // to account for the +N avatar below
                    )
                    .map((tripMember: TripMember) => {
                      const matchingUser: UserType | undefined = users.find(
                        (user) => user.uid === tripMember.uid
                      );
                      if (!matchingUser) return null;
                      return (
                        <Avatar
                          src={matchingUser?.photoURL as string}
                          gravatarEmail={matchingUser?.email as string}
                          size="sm"
                          key={matchingUser.uid}
                          username={matchingUser?.username}
                        />
                      );
                    })}
                {users && trip.tripMembers.length > MAX_TRIP_PARTY_SIZE && (
                  <Avatar
                    // never want to show +1, because then we could have just rendered the photo.
                    // Instead, lets add another so its always at least +2
                    staticContent={`+${trip.tripMembers.length - MAX_TRIP_PARTY_SIZE + 1}`}
                    size="sm"
                    username={`+${trip.tripMembers.length - MAX_TRIP_PARTY_SIZE + 1} more`}
                  />
                )}
              </StackedAvatars>
            )}
          </FlexContainer>
        </Column>
      </Row>

      <StyledLineItem>
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaRegCalendar style={{ marginRight: halfSpacer, top: quarterSpacer, flexShrink: 0 }} />
          {trip ? (
            <>
              {trip.tripLength === 21
                ? formattedDate(new Date(trip.startDate.seconds * 1000))
                : formattedDateRange(trip.startDate.seconds * 1000, trip.endDate.seconds * 1000)}
            </>
          ) : (
            <div style={{ flex: 1 }}>
              <Skeleton count={1} width="50%" />
            </div>
          )}
        </FlexContainer>
      </StyledLineItem>

      <StyledLineItem>
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaMapMarkerAlt style={{ marginRight: halfSpacer, top: quarterSpacer, flexShrink: 0 }} />
          {trip ? (
            trip.startingPoint
          ) : (
            <div style={{ flex: 1 }}>
              <Skeleton count={1} width="65%" />
            </div>
          )}
        </FlexContainer>
      </StyledLineItem>

      {trip ? (
        <>
          {trip.description !== '' && (
            <>
              <HorizontalRule compact />
              <TextTruncate
                line={1}
                element="p"
                truncateText="…"
                text={trip.description || 'No description provided'}
                containerClassName="truncatedText"
              />
            </>
          )}
        </>
      ) : (
        <Skeleton count={1} />
      )}
    </StyledTripWrapper>
  );
};

export default TripCard;
