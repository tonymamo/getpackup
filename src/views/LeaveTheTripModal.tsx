import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { FaSignOutAlt } from 'react-icons/fa';

import { addAlert } from '@redux/ducks/globalAlerts';
import { Button, Column, Heading, Modal, Row } from '@components';
import trackEvent from '@utils/trackEvent';
import { RootState } from '@redux/ducks';
import { TripMemberStatus, TripType } from '@common/trip';

type LeaveTheTripModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (val: boolean) => void;
  trip: TripType;
};

const LeaveTheTripModal: FunctionComponent<LeaveTheTripModalProps> = ({
  modalIsOpen,
  trip,
  setModalIsOpen,
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const leaveTrip = () => {
    if (trip.tripId) {
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
          trackEvent('User Left Trip Successfully', { tripId: trip.tripId, uid: auth.uid });
          navigate('/app/trips');
        })
        .catch((err) => {
          trackEvent('User Left Trip Failure', { tripId: trip.tripId, uid: auth.uid, error: err });
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
      <p>Are you sure you want to leave this trip? This action cannot be undone.</p>
      <Row>
        <Column xs={6}>
          <Button
            type="button"
            onClick={() => {
              trackEvent('Leave The Trip Modal Canceled', { tripId: trip.tripId, uid: auth.uid });
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
            onClick={() => leaveTrip()}
            block
            color="danger"
            iconLeft={<FaSignOutAlt />}
          >
            Leave Trip
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default LeaveTheTripModal;
