import { TripMemberStatus, TripType } from '@common/trip';
import { Button, Column, Heading, Modal, Row } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

type RemoveUserFromTripModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (val: boolean) => void;
  trip: TripType;
  uid: string;
};

const RemoveUserFromTripModal: FunctionComponent<RemoveUserFromTripModalProps> = ({
  modalIsOpen,
  trip,
  setModalIsOpen,
  uid,
}) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const removeFromTrip = () => {
    if (trip.tripId && uid) {
      firebase
        .firestore()
        .collection('trips')
        .doc(trip.tripId)
        .update({
          [`tripMembers.${uid}`]: {
            uid,
            invitedAt: trip?.tripMembers[`${uid}`].invitedAt,
            removedAt: new Date(),
            status: TripMemberStatus.Removed,
          },
        })
        .then(() => {
          setModalIsOpen(false);
          trackEvent('Removed User From Trip Successfully', { tripId: trip.tripId, uid });
        })
        .catch((err) => {
          setModalIsOpen(false);
          trackEvent('Removed User From Trip Failure', { tripId: trip.tripId, uid, error: err });
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
      <p>Are you sure you want to remove this user? This action cannot be undone.</p>
      <Row>
        <Column xs={6}>
          <Button
            type="button"
            onClick={() => {
              trackEvent('Remove User From Trip Modal Canceled', { tripId: trip.tripId, uid });
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
            onClick={() => removeFromTrip()}
            block
            color="danger"
            iconLeft={<FaSignOutAlt />}
          >
            Remove From Trip
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default RemoveUserFromTripModal;
