import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Column, Heading, Modal, Row } from '@components';
import { hideWorkerUpdateModal } from '@redux/ducks/workerUpdateReady';

const UpdateConfirmModal: FunctionComponent = () => {
  const showModal: boolean = useSelector((state: any) => state.workerUpdateReady.display);
  const dispatch = useDispatch();

  return (
    <Modal
      toggleModal={() => dispatch(hideWorkerUpdateModal())}
      isOpen={showModal}
    >
      <Heading>Latest Version</Heading>
      <p>This application has been updated. Reload to display the latest version?</p>
      <Row>
        <Column xs={6}>
          <Button
            type="button"
            color="primaryOutline"
            block
            onClick={() => dispatch(hideWorkerUpdateModal())}
          >
            Cancel
          </Button>
        </Column>
        <Column xs={6}>
          <Button
            type="button"
            block
            color="danger"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default UpdateConfirmModal;
