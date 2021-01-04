import React, { FunctionComponent } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

import { baseBorderStyle, z1Shadow } from '../styles/mixins';
import { borderRadius, halfSpacer, screenSizes, doubleSpacer } from '../styles/size';

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
};

const CloseIcon = styled.span`
  position: absolute;
  top: ${halfSpacer};
  right: ${halfSpacer};
  cursor: pointer;
`;

const Modal: FunctionComponent<ModalProps> = (props) => (
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
        margin: '0 auto',
        top: doubleSpacer,
        right: doubleSpacer,
        left: doubleSpacer,
        bottom: 'initial',
        marginBottom: doubleSpacer,
        WebkitOverflowScrolling: 'touch',
      },
      overlay: {
        backgroundColor: 'rgba(0,0,0,.75)',
        position: 'fixed',
        height: '100%',
        overflow: 'auto',
        zIndex: 1,
      },
    }}
  >
    <CloseIcon onClick={props.toggleModal}>
      <FaTimes />
    </CloseIcon>
    {props.children}
  </ReactModal>
);

export default Modal;
