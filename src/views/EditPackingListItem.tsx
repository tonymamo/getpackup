import React, { FunctionComponent, useState } from 'react';
import { FaCheck, FaChevronLeft, FaTrash } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

import {
  Button,
  Column,
  FlexContainer,
  Heading,
  HorizontalRule,
  Input,
  Modal,
  Row,
} from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { requiredField, requiredSelect } from '@utils/validations';
import { gearListCategories } from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';

type EditPackingListItemProps = {
  tripId: string;
  activeItem?: PackingListItemType;
  backToPackingListClick: () => void;
  setActivePackingListItem: (value: undefined) => void;
};

const EditPackingListItem: FunctionComponent<EditPackingListItemProps> = (props) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const removeItem = () => {
    firebase
      .firestore()
      .collection('trips')
      .doc(props.tripId)
      .collection('packing-list')
      .doc(props.activeItem?.id)
      .delete()
      .then(() => {
        dispatch(
          addAlert({
            type: 'success',
            message: 'Successfully removed item',
          })
        );
        props.setActivePackingListItem(undefined);
        props.backToPackingListClick();
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  return (
    <div>
      {props.activeItem ? (
        <Formik
          validateOnMount
          initialValues={{
            ...props.activeItem,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (props.activeItem) {
              firebase
                .firestore()
                .collection('trips')
                .doc(props.tripId)
                .collection('packing-list')
                .doc(props.activeItem?.id)
                .update({
                  ...props.activeItem,
                  ...values,
                  quantity: Number(values.quantity),
                })
                .then(() => {
                  resetForm({ values });
                  dispatch(
                    addAlert({
                      type: 'success',
                      message: `Updated ${values.name}`,
                    })
                  );
                  props.setActivePackingListItem(undefined);
                  props.backToPackingListClick();
                })
                .catch((err) => {
                  dispatch(
                    addAlert({
                      type: 'danger',
                      message: err.message,
                    })
                  );
                });
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid, values, setFieldValue, ...rest }) => (
            <Form>
              <Heading altStyle as="h2">
                Edit Item
              </Heading>
              <Field
                as={Input}
                type="text"
                name="name"
                label="Name"
                validate={requiredField}
                required
              />
              <Field as={Input} type="textarea" name="description" label="Description" />
              <Field
                as={Input}
                type="number"
                name="quantity"
                label="Quantity"
                setFieldValue={setFieldValue}
              />
              <Field
                as={Input}
                type="select"
                name="category"
                label="Category"
                options={gearListCategories}
                validate={requiredSelect}
                setFieldValue={setFieldValue}
                {...rest}
                required
              />

              <Row>
                <Column xs={6}>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    block
                    color="success"
                    iconLeft={<FaCheck />}
                  >
                    Update
                  </Button>
                </Column>
                <Column xs={6}>
                  <Button
                    type="button"
                    onClick={() => {
                      props.setActivePackingListItem(undefined);
                      props.backToPackingListClick();
                    }}
                    block
                    color="primaryOutline"
                    iconLeft={<FaChevronLeft />}
                  >
                    Cancel
                  </Button>
                </Column>
              </Row>

              <HorizontalRule />
              <Button
                type="button"
                onClick={() => setModalIsOpen(true)}
                block
                color="danger"
                iconLeft={<FaTrash />}
              >
                Remove
              </Button>
              <Modal
                toggleModal={() => {
                  setModalIsOpen(false);
                }}
                isOpen={modalIsOpen}
              >
                <Heading altStyle>Are you sure?</Heading>
                <p>
                  Are you sure you want to remove <strong>{values.name}</strong> from your packing
                  list? This action cannot be undone.
                </p>
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
                      onClick={() => removeItem()}
                      block
                      color="danger"
                      iconLeft={<FaTrash />}
                    >
                      Remove
                    </Button>
                  </Column>
                </Row>
              </Modal>
            </Form>
          )}
        </Formik>
      ) : (
        <FlexContainer height="30vh">
          <p>Select an item to edit</p>
        </FlexContainer>
      )}
    </div>
  );
};

export default EditPackingListItem;
