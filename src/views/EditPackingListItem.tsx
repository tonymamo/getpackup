import React, { FunctionComponent } from 'react';
import { FaChevronLeft, FaTrash } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';

import { Alert, AutoSave, Button, DropdownMenu, FlexContainer, Heading, Input } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { requiredField, requiredSelect } from '@utils/validations';
import { gearListCategories } from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import useWindowSize from '@utils/useWindowSize';

type EditPackingListItemProps = {
  tripId?: string;
  id?: string;
} & RouteComponentProps;

const EditPackingListItem: FunctionComponent<EditPackingListItemProps> = (props) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const packingList = useSelector((state: RootState) => state.firestore.ordered.packingList);

  const size = useWindowSize();

  const activeItem =
    packingList && packingList.find((item: PackingListItemType) => item.id === props.id);

  const removeItem = () => {
    if (activeItem) {
      navigate(-1);
      firebase
        .firestore()
        .collection('trips')
        .doc(props.tripId)
        .collection('packing-list')
        .doc(activeItem?.id)
        .delete()
        .then(() => {
          dispatch(
            addAlert({
              type: 'success',
              message: `${activeItem.name} has been removed`,
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
    <div>
      {!size.isSmallScreen && (
        <Button
          type="button"
          onClick={() => navigate(-1)}
          color="text"
          iconLeft={<FaChevronLeft />}
        >
          Back
        </Button>
      )}
      {activeItem ? (
        <Formik
          validateOnMount
          initialValues={{
            ...activeItem,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (activeItem) {
              firebase
                .firestore()
                .collection('trips')
                .doc(props.tripId)
                .collection('packing-list')
                .doc(activeItem?.id)
                .update({
                  ...activeItem,
                  ...values,
                  quantity: Number(values.quantity),
                })
                .then(() => {
                  resetForm({ values });
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
          {({ setFieldValue, ...rest }) => (
            <Form>
              <FlexContainer justifyContent="space-between">
                <Heading altStyle as="h2">
                  Edit Item
                </Heading>
                <DropdownMenu>
                  <Button
                    type="button"
                    onClick={() => removeItem()}
                    color="danger"
                    iconLeft={<FaTrash />}
                  >
                    Remove Item
                  </Button>
                </DropdownMenu>
              </FlexContainer>
              <AutoSave />
              {activeItem.isEssential && (
                <Alert
                  type="info"
                  message="This item is considered one of the 10 Essential items."
                  callToActionLink="https://www.mountaineers.org/blog/what-are-the-ten-essentials"
                  callToActionLinkText="Learn more"
                />
              )}
              <Field
                as={Input}
                type="text"
                name="name"
                label="Name"
                validate={requiredField}
                required
              />

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
              <Field as={Input} type="textarea" name="description" label="Description" />
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
