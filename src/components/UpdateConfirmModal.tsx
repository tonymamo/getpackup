import { Button, Column, Heading, Modal, Row } from '@components';
import { hideWorkerUpdateModal } from '@redux/ducks/workerUpdateReady';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UpdateConfirmModal: FunctionComponent = () => {
  const showModal: boolean = useSelector((state: any) => state.workerUpdateReady.display);
  const dispatch = useDispatch();
  const autoReloadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // When the modal is shown, start a timer to auto-reload after 3 seconds
    // This ensures users get the latest version even if they don't interact with the modal
    if (showModal) {
      autoReloadTimerRef.current = window.setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    // Cleanup: clear the timer if the modal is closed or component unmounts
    return () => {
      if (autoReloadTimerRef.current) {
        clearTimeout(autoReloadTimerRef.current);
      }
    };
  }, [showModal]);

  const handleCancel = () => {
    // Clear auto-reload timer if user cancels
    if (autoReloadTimerRef.current) {
      clearTimeout(autoReloadTimerRef.current);
    }
    dispatch(hideWorkerUpdateModal());
  };

  const handleReload = () => {
    // Clear timer and reload immediately
    if (autoReloadTimerRef.current) {
      clearTimeout(autoReloadTimerRef.current);
    }
    dispatch(hideWorkerUpdateModal());
    window.location.reload();
  };

  return (
    <Modal toggleModal={handleCancel} isOpen={showModal}>
      <Heading>Latest Version</Heading>
      <p>This application has been updated. Reload to display the latest version?</p>
      <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
        Page will automatically reload in 3 seconds...
      </p>
      <Row>
        <Column xs={6}>
          <Button type="button" color="primaryOutline" block onClick={handleCancel}>
            Cancel
          </Button>
        </Column>
        <Column xs={6}>
          <Button type="button" block color="danger" onClick={handleReload}>
            Reload Now
          </Button>
        </Column>
      </Row>
    </Modal>
  );
};

export default UpdateConfirmModal;
