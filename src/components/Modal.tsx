import React, { FunctionComponent } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { borderRadius, halfSpacer, screenSizes, doubleSpacer } from '@styles/size';
import { zIndexModal } from '@styles/layers';

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  hideCloseButton?: boolean;
};

const CloseIcon = styled.span`
  position: absolute;
  top: ${halfSpacer};
  right: ${halfSpacer};
  cursor: pointer;
`;

const Modal: FunctionComponent<ModalProps> = (props) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={props.toggleModal}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      style={{
        content: {
          border: baseBorderStyle,
          boxShadow: z1Shadow,
          borderRadius,
          maxWidth: screenSizes.medium,
          margin: doubleSpacer,
          WebkitOverflowScrolling: 'touch',
          width: '90%',
          inset: 'unset',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,.75)',
          position: 'fixed',
          height: '100%',
          overflow: 'auto',
          zIndex: zIndexModal,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      {!props.hideCloseButton && (
        <CloseIcon onClick={props.toggleModal}>
          <FaTimes />
        </CloseIcon>
      )}
      {props.children}
    </ReactModal>
  );
};

export default Modal;
