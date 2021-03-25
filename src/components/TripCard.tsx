import React, { FunctionComponent } from 'react';
import { FaRegCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';
import { navigate, Link } from 'gatsby';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  FlexContainer,
  Heading,
  StackedAvatars,
  Avatar,
  HorizontalRule,
  Pill,
  Button,
  Row,
  Column,
  DropdownMenu,
} from '@components';
import { halfSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';

type TripCardProps = {
  trip: TripType;
  loggedInUser?: UserType;
  showDescription?: boolean;
  showTags?: boolean;
  enableNavigation?: boolean;
};

const StyledTripWrapper = styled.div`
  cursor: pointer;
`;

const PillWrapper = styled.div`
  display: flex;
  margin: ${halfSpacer} 0;
  overflow-x: scroll;
  overscroll-behavior: contain;
  scrollbar-width: none;
  touch-action: pan-x;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  & span {
    flex-shrink: 0;
  }
`;

const TripCard: FunctionComponent<TripCardProps> = ({
  trip,
  loggedInUser,
  showDescription,
  showTags,
  enableNavigation,
}) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);

  const numberOfAvatarsToShow = 4;
  return (
    <StyledTripWrapper
      role="link"
      tabIndex={0}
      onClick={() => (enableNavigation ? navigate(`/app/trips/${trip.tripId}`) : null)}
      onKeyPress={() => (enableNavigation ? navigate(`/app/trips/${trip.tripId}`) : null)}
    >
      <FlexContainer justifyContent="space-between" flexWrap="nowrap" alignItems="flex-start">
        <Heading as="h3" altStyle>
          {enableNavigation ? (
            <Link to={`/app/trips/${trip.tripId}/`}>{trip.name}</Link>
          ) : (
            trip.name
          )}
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
      {showTags && (
        <>
          <PillWrapper>
            {trip.tags.map((tag: string) => (
              <Pill
                key={`${tag}tag`}
                // TODO: link to tags
                // to={`/search/tags/${tag.replace(' ', '-')}`}
                text={tag}
                color="primary"
              />
            ))}
          </PillWrapper>
          <Row>
            <Column xs={5}>
              <p>
                <Button block type="link" to={`/app/trips/${trip.tripId}/summary`} color="tertiary">
                  Details
                </Button>
              </p>
            </Column>
            <Column xs={5}>
              <p>
                <Button block type="link" to={`/app/trips/${trip.tripId}/summary`} color="tertiary">
                  Party
                </Button>
              </p>
            </Column>
            <Column xs={2}>
              <DropdownMenu>
                <Button block type="link" to={`/app/trips/${trip.tripId}/summary`} color="tertiary">
                  Delete
                </Button>
              </DropdownMenu>
            </Column>
          </Row>
        </>
      )}
      {showDescription && (
        <TextTruncate line={1} element="p" truncateText="…" text={trip.description} />
      )}
    </StyledTripWrapper>
  );
};

export default TripCard;
