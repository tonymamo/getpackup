import React, { FunctionComponent } from 'react';
import { FaRegCalendar, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { Link, navigate } from 'gatsby';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';

import { TripMemberStatus, TripType } from '@common/trip';
import {
  Heading,
  FlexContainer,
  Row,
  Column,
  Button,
  TripHeaderImage,
  TripMemberAvatars,
} from '@components';
import { baseSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import { addAlert } from '@redux/ducks/globalAlerts';
import { baseBorderStyle } from '@styles/mixins';
import { white } from '@styles/color';

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
  background-color: ${white};
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
    <StyledTripWrapper isPending={isPending} onClick={onClick}>
      <TripHeaderImage trip={trip} />

      <FlexContainer justifyContent="space-between" flexWrap="nowrap">
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
          {trip ? (
            trip.startingPoint
          ) : (
            <div style={{ flex: 1 }}>
              <Skeleton count={1} width="65%" />
            </div>
          )}
        </FlexContainer>
      </StyledLineItem>

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
