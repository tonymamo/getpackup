import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { FaTrash } from 'react-icons/fa';

import { addAlert } from '@redux/ducks/globalAlerts';
import { Button, Column, Heading, Modal, Row } from '@components';
import trackEvent from '@utils/trackEvent';

type TripDeleteModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (val: boolean) => void;
  tripId: string;
};

const TripDeleteModal: FunctionComponent<TripDeleteModalProps> = ({
  modalIsOpen,
  tripId,
  setModalIsOpen,
}) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const deleteTrip = () => {
    if (tripId) {
      firebase
        .firestore()
        .collection('trips')
        .doc(tripId)
        .delete()
        .then(() => {
          trackEvent('Trip Deleted Successfully', { tripId });
          navigate('/app/trips');
          dispatch(
            addAlert({
              type: 'success',
              message: 'Successfully deleted trip',
            })
          );
        })
        .catch((err) => {
          trackEvent('Trip Delete Failure', { tripId, error: err });
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
      <p>Are you sure you want to delete this trip? This action cannot be undone.</p>
      <Row>
        <Column xs={6}>
          <Button
            type="button"
            onClick={() => {
              trackEvent('Trip Delete Modal Canceled', { tripId });
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
            onClick={() => deleteTrip()}
            block
            color="danger"
            iconLeft={<FaTrash />}
          >
            Delete
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default TripDeleteModal;
