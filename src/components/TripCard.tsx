import React, { FunctionComponent } from 'react';
import { FaRegCalendar, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';
import { Link, navigate } from 'gatsby';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';

import { TripMember, TripMemberStatus, TripType } from '@common/trip';
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
  Button,
} from '@components';
import { baseSpacer, doubleSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { brandSecondary, lightestGray } from '@styles/color';
import { addAlert } from '@redux/ducks/globalAlerts';

type TripCardProps = {
  trip?: TripType;
  isPending?: boolean;
};

const StyledTripWrapper = styled.div<{ isPending?: boolean }>`
  cursor: ${(props) => (props.isPending ? 'initial' : 'pointer')};
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

const TripCard: FunctionComponent<TripCardProps> = ({ trip, isPending }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const { isExtraSmallScreen, isSmallScreen } = useWindowSize();
  // Box.tsx adjusts padding at small breakpoint, so use this var to change accordingly
  const negativeSpacingSize = isExtraSmallScreen ? baseSpacer : doubleSpacer;

  const numberOfAvatarsToShow = 4;

  const acceptedTripMembersOnly =
    trip &&
    trip.tripMembers &&
    Object.values(trip.tripMembers).filter(
      (member) =>
        member.status === TripMemberStatus.Accepted || member.status === TripMemberStatus.Owner
    );

  useFirestoreConnect([
    {
      collection: 'users',
      where: [
        'uid',
        'in',
        trip && trip.tripMembers && Object.keys(trip.tripMembers).length > 0
          ? Object.keys(trip.tripMembers)
          : [auth.uid],
      ],
    },
  ]);

  const acceptInvitation = () => {
    if (trip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(trip.tripId)
        .update({
          [`tripMembers.${auth.uid}`]: {
            uid: auth.uid,
            invitedAt: trip?.tripMembers[`${auth.uid}`].invitedAt,
            acceptedAt: new Date(),
            status: TripMemberStatus.Accepted,
          },
        })
        .then(() => {
          trackEvent('Trip Party Member Accepted', {
            ...trip,
            acceptedMember: auth.uid,
          });
          dispatch(
            addAlert({
              type: 'success',
              message: `Excellent! Let's start thinking about whay you'll need to bring next 🤙`,
            })
          );
          navigate(`/app/trips/${trip.tripId}/generator`);
        })
        .catch((err) => {
          trackEvent('Trip Party Member Accept Failure', {
            ...trip,
            acceptedMember: auth.uid,
            error: err,
          });
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  const declineInvitation = () => {
    if (trip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(trip.tripId)
        .update({
          [`tripMembers.${auth.uid}`]: {
            uid: auth.uid,
            invitedAt: trip?.tripMembers[`${auth.uid}`].invitedAt,
            declinedAt: new Date(),
            status: TripMemberStatus.Declined,
          },
        })
        .then(() => {
          trackEvent('Trip Party Member Declined', {
            ...trip,
            declinedMember: auth.uid,
          });
          dispatch(
            addAlert({
              type: 'success',
              message: `Bummer... You have successfully declined to go on the trip 😔`,
            })
          );
        })
        .catch((err) => {
          trackEvent('Trip Party Member Decline Failure', {
            ...trip,
            declinedMember: auth.uid,
            error: err,
          });
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  return (
    <StyledTripWrapper isPending={isPending}>
      <NegativeMarginContainer
        top={negativeSpacingSize}
        left={negativeSpacingSize}
        right={negativeSpacingSize}
        aspectRatio={4}
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
                <>
                  {isPending ? (
                    trip.name
                  ) : (
                    <Link
                      to={`/app/trips/${trip.tripId}/`}
                      onClick={() => trackEvent('Trip Card Heading Link Clicked', { trip })}
                    >
                      {trip.name}
                    </Link>
                  )}
                </>
              ) : (
                <Skeleton width={200} />
              )}
            </Heading>
          </FlexContainer>
        </Column>
        <Column md={4}>
          <FlexContainer justifyContent={isSmallScreen ? 'flex-start' : 'flex-end'}>
            {acceptedTripMembersOnly && acceptedTripMembersOnly.length > 0 && (
              <StackedAvatars>
                {users &&
                  acceptedTripMembersOnly
                    .slice(
                      0,
                      acceptedTripMembersOnly?.length === numberOfAvatarsToShow
                        ? numberOfAvatarsToShow
                        : numberOfAvatarsToShow - 1 // to account for the +N avatar below
                    )
                    .map((tripMember: TripMember) => {
                      const matchingUser: UserType = users[tripMember.uid]
                        ? users[tripMember.uid]
                        : undefined;
                      if (!matchingUser) return null;
                      return (
                        <Avatar
                          src={matchingUser?.photoURL as string}
                          gravatarEmail={matchingUser?.email as string}
                          size="sm"
                          key={matchingUser.uid}
                          username={matchingUser?.username.toLocaleLowerCase()}
                        />
                      );
                    })}
                {users && acceptedTripMembersOnly.length > numberOfAvatarsToShow && (
                  <Avatar
                    // never want to show +1, because then we could have just rendered the photo.
                    // Instead, lets add another so its always at least +2
                    staticContent={`+${acceptedTripMembersOnly.length - numberOfAvatarsToShow + 1}`}
                    size="sm"
                    username={`+${acceptedTripMembersOnly.length - numberOfAvatarsToShow + 1} more`}
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
          {trip && trip.startDate ? (
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

      {isPending && (
        <Row>
          <Column xs={6}>
            <Button
              type="button"
              block
              color="success"
              iconLeft={<FaCheck />}
              onClick={acceptInvitation}
            >
              Accept
            </Button>
          </Column>
          <Column xs={6}>
            <Button
              type="button"
              block
              color="danger"
              iconLeft={<FaTimes />}
              onClick={declineInvitation}
            >
              Decline
            </Button>
          </Column>
        </Row>
      )}
    </StyledTripWrapper>
  );
};

export default TripCard;
