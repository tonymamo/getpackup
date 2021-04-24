import React, { FunctionComponent } from 'react';
import { FaChevronLeft, FaTrash } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';

import {
  Alert,
  AutoSave,
  Button,
  FlexContainer,
  Heading,
  HorizontalRule,
  Input,
  Seo,
} from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { requiredField, requiredSelect } from '@utils/validations';
import { gearListCategories } from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import useWindowSize from '@utils/useWindowSize';
import trackEvent from '@utils/trackEvent';

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
          trackEvent('Packing List Item Removed', { ...activeItem });
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
      <Seo title="Edit Item" />
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
                  trackEvent('Packing List Item Edited', {
                    ...activeItem,
                    ...values,
                  });
                })
                .catch((err) => {
                  dispatch(
                    addAlert({
                      type: 'danger',
                      message: err.message,
                    })
                  );
                  trackEvent('Packing List Item Edited Failure', {
                    ...activeItem,
                    ...values,
                    error: err,
                  });
                });
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, ...rest }) => (
            <Form>
              <Heading altStyle as="h2">
                {values.name}
              </Heading>

              {activeItem.isEssential && (
                <Alert
                  type="info"
                  message="This item is considered one of the 10 Essential items."
                  callToActionLink="/blog/2021-03-29-the-ten-essentials/"
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
              <AutoSave />

              <HorizontalRule />
              <Button
                type="button"
                onClick={() => removeItem()}
                color="danger"
                iconLeft={<FaTrash />}
              >
                Remove Item
              </Button>
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
