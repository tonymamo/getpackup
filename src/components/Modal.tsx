import React, { FunctionComponent, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { useMeasure } from 'react-use';

import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { borderRadius, halfSpacer, screenSizes, doubleSpacer, baseSpacer } from '@styles/size';
import { zIndexModal } from '@styles/layers';

type ModalProps = {
  isOpen: boolean;
  toggleModal: () => void;
  hideCloseButton?: boolean;
  largePadding?: boolean;
};

const CloseIcon = styled.span`
  position: absolute;
  top: ${halfSpacer};
  right: ${halfSpacer};
  cursor: pointer;
`;

const Modal: FunctionComponent<ModalProps> = (props) => {
  const defaultHeight = 0;

  // The height of the modal
  const [contentHeight, setContentHeight] = useState(defaultHeight);

  // Gets the height of the element (ref)

  const [ref, { height }] = useMeasure();

  useEffect(() => {
    // Sets initial height
    setContentHeight(height);

    // Adds resize event listener
    window.addEventListener('resize', () => setContentHeight(height));

    // Clean-up
    return window.removeEventListener('resize', () => setContentHeight(height));
  }, [height]);

  return (
    <ReactModal
      contentRef={ref}
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
          top: contentHeight ? `calc(50vh - ${contentHeight}px)` : doubleSpacer,
          right: doubleSpacer,
          left: doubleSpacer,
          bottom: 'initial',
          marginBottom: doubleSpacer,
          WebkitOverflowScrolling: 'touch',
          padding: props.largePadding ? doubleSpacer : baseSpacer,
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,.75)',
          position: 'fixed',
          height: '100%',
          overflow: 'auto',
          zIndex: zIndexModal,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
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
