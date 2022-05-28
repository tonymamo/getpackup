import { TripMember, TripMemberStatus, TripType } from '@common/trip';
import { Button, Column, Heading, Modal, Row } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import sendTripInvitationEmail from '@utils/sendTripInvitationEmail';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

type ReinviteUserToTripModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (val: boolean) => void;
  trip: TripType;
  tripMember: TripMember;
  profile: any;
  tripMemberEmail: string;
  greetingName: string;
};

const ReinviteUserToTripModal: FunctionComponent<ReinviteUserToTripModalProps> = ({
  modalIsOpen,
  trip,
  setModalIsOpen,
  tripMember,
  profile,
  tripMemberEmail,
  greetingName,
}) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const reinviteToTrip = () => {
    if (trip.tripId && tripMember) {
      firebase
        .firestore()
        .collection('trips')
        .doc(trip.tripId)
        .update({
          [`tripMembers.${tripMember.uid}`]: {
            uid: tripMember.uid,
            invitedAt: trip?.tripMembers[`${tripMember.uid}`].invitedAt,
            removedAt: new Date(),
            status: TripMemberStatus.Pending,
          },
        })
        .then(() => {
          trackEvent('Reinvited User to Trip Successfully', {
            tripId: trip.tripId,
            uid: tripMember.uid,
          });

          sendTripInvitationEmail({
            tripId: trip.tripId,
            invitedBy: profile.username,
            email: tripMemberEmail,
            greetingName,
            dispatch,
          });

          setModalIsOpen(false);
        })
        .catch((err) => {
          setModalIsOpen(false);
          trackEvent('Reinvited User to Trip Failure', {
            tripId: trip.tripId,
            uid: tripMember.uid,
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
    <Modal
      toggleModal={() => {
        setModalIsOpen(false);
      }}
      isOpen={modalIsOpen}
    >
      <Heading>Are you sure?</Heading>
      <p>Are you sure you want to re-invite this user?</p>
      <Row>
        <Column xs={6}>
          <Button
            type="button"
            onClick={() => {
              trackEvent('Reinvite User to Trip Modal Canceled', {
                tripId: trip.tripId,
                uid: tripMember.uid,
              });
              setModalIsOpen(false);
            }}
            color="primaryOutline"
            block
          >
            Cancel
          </Button>
        </Column>
        <Column xs={6}>
          <Button
            type="button"
            onClick={() => reinviteToTrip()}
            block
            color="success"
            iconLeft={<FaCheck />}
          >
            Re-invite to Trip
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default ReinviteUserToTripModal;
