import { TripMemberStatus, TripType } from '@common/trip';
import {
  Button,
  Column,
  FlexContainer,
  Heading,
  HorizontalScroller,
  Pill,
  Row,
  TripHeaderImage,
  TripMemberAvatars,
} from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { white } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { baseAndAHalfSpacer, baseSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import trackEvent from '@utils/trackEvent';
import { Link, navigate } from 'gatsby';
import React, { FunctionComponent, useMemo } from 'react';
import { FaCheck, FaMapMarkerAlt, FaRegCalendar, FaTimes } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import styled from 'styled-components';

type TripCardProps = {
  trip?: TripType;
  isPending?: boolean;
  onClick?: () => void;
};

const StyledTripWrapper = styled.div<{ isPending?: boolean }>`
  padding: ${baseSpacer};
  margin-bottom: ${baseSpacer};
  border: ${baseBorderStyle};
  cursor: ${(props) => (props.isPending ? 'initial' : 'pointer')};
  background-color: var(--color-backgroundAlt);
`;

const StyledLineItem = styled.div`
  margin-bottom: ${halfSpacer};
`;

const TripCard: FunctionComponent<TripCardProps> = ({ trip, isPending, onClick }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: 'users',
      where: [
        'uid',
        'in',
        trip && trip.tripMembers && Object.keys(trip.tripMembers)
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

  const getInvitedByName = useMemo(() => {
    let inviter: string | undefined;

    // need to wait for trip users to be loaded in redux, not just logged in user
    if (users && Object.keys(users).length > 1 && trip) {
      if (trip && trip.tripMembers && Object.keys(trip.tripMembers).length > 0) {
        if (
          auth.uid &&
          trip.tripMembers[auth.uid].invitedBy &&
          typeof trip.tripMembers[auth.uid].invitedBy === 'string'
        ) {
          inviter = users[`${trip.tripMembers[auth.uid].invitedBy}`]?.displayName || undefined;
        } else {
          const owner =
            trip.owner ||
            Object.values(trip.tripMembers).find(
              (member) => member.status === TripMemberStatus.Owner
            )?.uid;
          inviter = owner ? users[owner]?.displayName : undefined;
        }
      }
    }

    return inviter ? `You've been invited by ${inviter}` : null;
  }, [trip, users]);

  return (
    <StyledTripWrapper isPending={isPending} onClick={onClick}>
      <TripHeaderImage trip={trip} />

      <FlexContainer justifyContent="space-between" flexWrap="nowrap">
        <Heading as="h3" altStyle noMargin>
          {trip && trip.name ? (
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

        {trip && <TripMemberAvatars trip={trip} users={users} />}
      </FlexContainer>

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
          {trip && trip.startingPoint ? (
            trip.startingPoint
          ) : (
            <div style={{ flex: 1 }}>
              <Skeleton count={1} width="65%" />
            </div>
          )}
        </FlexContainer>
      </StyledLineItem>

      <div
        style={{
          margin: `${halfSpacer} -${baseSpacer}`,
          paddingLeft: halfSpacer,
        }}
      >
        <HorizontalScroller>
          {trip ? (
            <>
              {trip.tags &&
                trip.tags.length > 0 &&
                trip.tags.map((tag: string) => (
                  <Pill key={`${tag}tag`} text={tag} color="neutral" />
                ))}
            </>
          ) : (
            <>
              {/* Generate some tag placeholders and make widths dynamic with Math */}
              {Array.from({
                length: 7,
              }).map((_, i) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  // random widths between 48 and 128
                  width={Math.floor(Math.random() * (128 - 48 + 1) + 48)}
                  height={baseAndAHalfSpacer}
                  style={{
                    marginRight: halfSpacer,
                    borderRadius: baseAndAHalfSpacer,
                  }}
                />
              ))}
            </>
          )}
        </HorizontalScroller>
      </div>

      {isPending && trip && (
        <>
          {getInvitedByName && (
            <p>
              <strong>{getInvitedByName}</strong>
            </p>
          )}
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
        </>
      )}
    </StyledTripWrapper>
  );
};

export default TripCard;
