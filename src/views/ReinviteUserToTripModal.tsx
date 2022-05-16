import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { FaCheck } from 'react-icons/fa';

import { addAlert } from '@redux/ducks/globalAlerts';
import { Button, Column, Heading, Modal, Row } from '@components';
import trackEvent from '@utils/trackEvent';
import { TripMember, TripMemberStatus, TripType } from '@common/trip';
import { stringify } from 'query-string';
import axios from 'axios';

type ReinviteUserToTripModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (val: boolean) => void;
  trip: TripType;
  tripMember: TripMember;
  profile: any;
  tripMemberEmail: string;
};

const ReinviteUserToTripModal: FunctionComponent<ReinviteUserToTripModalProps> = ({
  modalIsOpen,
  trip,
  setModalIsOpen,
  tripMember,
  profile,
  tripMemberEmail,
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
          const queryParams = stringify({
            to: tripMemberEmail,
            subject: `${profile.username} has invited you on a trip`,
            username: profile.username,
            tripId: trip.tripId,
            isTestEnv: String(process.env.GATSBY_SITE_URL !== 'https://getpackup.com'),
          });
          const invitationUrl =
            process.env.GATSBY_SITE_URL === 'https://getpackup.com'
              ? `https://us-central1-getpackup.cloudfunctions.net/sendTripInvitationEmail?${queryParams}`
              : `https://us-central1-packup-test-fc0c2.cloudfunctions.net/sendTripInvitationEmail?${queryParams}`;

          axios.post(invitationUrl);

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
