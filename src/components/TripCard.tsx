import React, { FunctionComponent } from 'react';
import { FaRegCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';
import { Link } from 'gatsby';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Heading,
  StackedAvatars,
  Avatar,
  HorizontalRule,
  FlexContainer,
  NegativeMarginContainer,
  StaticMapImage,
  HeroImage,
} from '@components';
import { baseSpacer, doubleSpacer, halfSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { lightestGray } from '@styles/color';

type TripCardProps = {
  trip?: TripType;
  loggedInUser?: UserType;
  showDescription?: boolean;
  showTags?: boolean;
  enableNavigation?: boolean;
};

const StyledTripWrapper = styled.div``;

const StyledLineItem = styled.div`
  margin-bottom: ${halfSpacer};
`;

const TripCard: FunctionComponent<TripCardProps> = ({ trip, loggedInUser }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);

  const { isExtraSmallScreen } = useWindowSize();
  // Box.tsx adjusts padding at small breakpoint, so use this var to change accordingly
  const negativeSpacingSize = isExtraSmallScreen ? baseSpacer : doubleSpacer;
  const mapHeight = isExtraSmallScreen ? 125 : 250;

  const numberOfAvatarsToShow = 4;

  return (
    <StyledTripWrapper>
      <NegativeMarginContainer
        top={negativeSpacingSize}
        left={negativeSpacingSize}
        right={negativeSpacingSize}
      >
        {trip ? (
          <>
            {/* Aspect ratio is 16/4 or these images, but 5 works better for some reason? */}
            {trip.headerImage && <HeroImage staticImgSrc={trip.headerImage} aspectRatio={5} />}
            {!trip.headerImage && !!trip.lat && !!trip.lng && (
              <StaticMapImage
                lat={trip.lat}
                lng={trip.lng}
                height={mapHeight}
                width="100%"
                zoom={10}
                label={isExtraSmallScreen ? undefined : trip.startingPoint}
              />
            )}
          </>
        ) : (
          <div style={{ backgroundColor: lightestGray, height: mapHeight }} />
        )}
      </NegativeMarginContainer>

      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
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
        {trip && trip.tripMembers.length > 0 && (
          <StackedAvatars>
            <Avatar
              src={loggedInUser?.photoURL as string}
              gravatarEmail={loggedInUser?.email as string}
              size="sm"
            />
            {users &&
              trip.tripMembers
                .slice(
                  0,
                  trip.tripMembers.length === numberOfAvatarsToShow
                    ? numberOfAvatarsToShow
                    : numberOfAvatarsToShow - 1 // to account for the +N avatar below
                )
                .map((tripMember: any) => {
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
        )}
      </FlexContainer>

      <StyledLineItem>
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaRegCalendar style={{ marginRight: halfSpacer }} />
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
          <FaMapMarkerAlt style={{ marginRight: halfSpacer }} />
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
