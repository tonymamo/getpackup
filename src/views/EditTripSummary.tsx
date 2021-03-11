import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { FaTrash } from 'react-icons/fa';

import {
  Heading,
  PageContainer,
  FlexContainer,
  DropdownMenu,
  Button,
  Modal,
  Column,
  Row,
} from '@components';
import TripSummaryForm from '@views/TripSummaryForm';
import { TripType } from '@common/trip';
import { addAlert } from '@redux/ducks/globalAlerts';

type EditTripSummaryProps = {
  activeTrip?: TripType;
} & RouteComponentProps;

const EditTripSummary: FunctionComponent<EditTripSummaryProps> = ({ activeTrip }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const deleteTrip = () => {
    if (activeTrip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(activeTrip.tripId)
        .delete()
        .then(() => {
          navigate('/app/trips');
          dispatch(
            addAlert({
              type: 'success',
              message: 'Successfully deleted trip',
            })
          );
        })
        .catch((err) => {
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
    <>
      <PageContainer>
        {typeof activeTrip !== 'undefined' && (
          <>
            <FlexContainer justifyContent="space-between">
              <Heading altStyle as="h2">
                Edit Trip
              </Heading>
              <DropdownMenu>
                <Button
                  type="button"
                  color="text"
                  onClick={() => setModalIsOpen(true)}
                  iconLeft={<FaTrash />}
                >
                  Delete Trip
                </Button>
              </DropdownMenu>
            </FlexContainer>
            <TripSummaryForm
              initialValues={{
                ...activeTrip,
                startDate: new Date(activeTrip.startDate.seconds * 1000),
                endDate: new Date(activeTrip.endDate.seconds * 1000),
              }}
              type="edit"
            />
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
          </>
        )}
      </PageContainer>
    </>
  );
};

export default EditTripSummary;
