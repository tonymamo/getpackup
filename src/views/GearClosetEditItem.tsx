import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { FaCheckCircle, FaChevronLeft, FaTrash } from 'react-icons/fa';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import omit from 'lodash/omit';

import {
  Seo,
  Heading,
  LoadingPage,
  PageContainer,
  Button,
  Input,
  Column,
  Row,
  CollapsibleBox,
  Alert,
  FlexContainer,
  Modal,
} from '@components';
import { GearItemType, GearListEnumType } from '@common/gearItem';
import trackEvent from '@utils/trackEvent';
import usePersonalGear from '@hooks/usePersonalGear';
import { requiredField, requiredSelect } from '@utils/validations';
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListCategories,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';

type GearClosetEditItemProps = {
  id?: string;
} & RouteComponentProps;

const GearClosetEditItem: FunctionComponent<GearClosetEditItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const personalGear = usePersonalGear();
  const [isLoading, setIsLoading] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItemType | undefined>(undefined);

  const activeItem: GearItemType =
    personalGear &&
    personalGear.length > 0 &&
    personalGear !== 'loading' &&
    personalGear.find((item: GearItemType) => item.id === props.id);

  const initialValues: GearItemType = {
    quantity: 1,
    weight: '',
    weightUnit: 'g',
    notes: '',
    // above are defaults since Master Gear List Items won't have them,
    // and spreading activeItem below will overwrite them if they are available
    ...activeItem,
  };

  const save = (values: typeof initialValues) => {
    // update a custom gear item that already exists
    if (values.isCustomGearItem) {
      return firebase
        .firestore()
        .collection('gear-closet')
        .doc(auth.uid)
        .collection('additions')
        .doc(props.id)
        .set({
          ...values,
          isCustomGearItem: true,
          updated: new Date(),
        });
    }
    // add the id of the original master gear list item to the removals array
    // then create a new custom gear item
    return firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        removals: firebase.firestore.FieldValue.arrayUnion(values.id),
      })
      .then(() => {
        firebase
          .firestore()
          .collection('gear-closet')
          .doc(auth.uid)
          .collection('additions')
          .add({
            ...omit(values, 'id'),
            isCustomGearItem: true,
            created: new Date(),
          })
          .then((docRef) => {
            docRef.update({
              id: docRef.id,
            });
          });
      });
  };

  const onSubmit = (
    values: typeof initialValues,
    { resetForm, setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setIsLoading(true);

    save(values)
      .then(() => {
        resetForm();
        trackEvent('Gear Closet Edit Item Submitted', { values });
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully updated ${values.name}`,
          })
        );
      })
      .catch((error: Error) => {
        trackEvent('Gear Closet Edit Item Submit Failure', { values, error });
        dispatch(
          addAlert({
            type: 'danger',
            message: `Failed to update ${values.name}, please try again.`,
          })
        );
      })
      .finally(() => {
        setSubmitting(false);
        navigate(-1);
      });
  };

  const deleteItem = (item: GearItemType) => {
    const deleteType = () => {
      if (item.isCustomGearItem) {
        // Custom item, so delete it from the user's Additions collection
        return firebase
          .firestore()
          .collection('gear-closet')
          .doc(auth.uid)
          .collection('additions')
          .doc(item.id)
          .delete();
      }
      // Not a custom gear item, so add to Removals list
      return firebase
        .firestore()
        .collection('gear-closet')
        .doc(auth.uid)
        .update({
          removals: firebase.firestore.FieldValue.arrayUnion(item.id),
        });
    };

    deleteType()
      .then(() => {
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully deleted ${item.name}`,
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
    setItemToBeDeleted(undefined);
    setModalIsOpen(false);
    navigate(-1);
  };

  const getSelectedCount = (arr: GearListEnumType, values: typeof initialValues) => {
    const count = arr.filter((item) => values[item.name] === true).length;
    return `${count} ${count === 1 ? 'category' : 'categories'} selected`;
  };

  return (
    <PageContainer>
      <Seo title="Edit Gear Closet Item" />
      <Button
        type="button"
        onClick={() => {
          navigate(-1);
          trackEvent('Edit Gear Closet Item Back to All Gear Click', { ...activeItem });
        }}
        color="text"
        iconLeft={<FaChevronLeft />}
      >
        Back to All Gear
      </Button>

      {activeItem && (
        <>
          <Heading>Edit Gear Item</Heading>
          {activeItem.essential && (
            <Alert
              type="info"
              message="This item is considered one of the 10 Essential items."
              callToActionLink="/blog/2021-03-29-the-ten-essentials/"
              callToActionLinkText="Learn more"
            />
          )}
          <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, isSubmitting, isValid, setFieldValue, ...rest }) => (
              <Form>
                <Row>
                  <Column sm={6}>
                    <Field
                      as={Input}
                      type="text"
                      name="name"
                      label="Item Name"
                      validate={requiredField}
                      required
                    />
                  </Column>
                  <Column sm={6}>
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
                  </Column>
                  <Column sm={6}>
                    <Field
                      as={Input}
                      type="number"
                      name="quantity"
                      label="Quantity"
                      setFieldValue={setFieldValue}
                    />
                  </Column>
                  <Column sm={6}>
                    <Row>
                      <Column xs={8}>
                        <Field as={Input} type="text" name="weight" label="Weight" />
                      </Column>
                      <Column xs={4}>
                        <Field
                          as={Input}
                          type="select"
                          name="weightUnit"
                          label="Unit"
                          options={[
                            { value: 'g', label: 'g' },
                            { value: 'kg', label: 'kg' },
                            { value: 'oz', label: 'oz' },
                            { value: 'lb', label: 'lb' },
                          ]}
                          setFieldValue={setFieldValue}
                          {...rest}
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>
                <Field as={Input} type="textarea" name="notes" label="Notes/Description" />
                <CollapsibleBox
                  title="Activities"
                  defaultClosed
                  subtitle={getSelectedCount(gearListActivities, values)}
                >
                  <Row>
                    {gearListActivities.map((item) => (
                      <Column xs={6} md={4} lg={3} key={item.name}>
                        <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                      </Column>
                    ))}
                  </Row>
                </CollapsibleBox>
                <CollapsibleBox
                  title="Accommodations"
                  defaultClosed
                  subtitle={getSelectedCount(gearListAccommodations, values)}
                >
                  <Row>
                    {gearListAccommodations.map((item) => (
                      <Column xs={6} md={4} lg={3} key={item.name}>
                        <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                      </Column>
                    ))}
                  </Row>
                </CollapsibleBox>
                <CollapsibleBox
                  title="Camp Kitchen"
                  defaultClosed
                  subtitle={getSelectedCount(gearListCampKitchen, values)}
                >
                  <Row>
                    {gearListCampKitchen.map((item) => (
                      <Column xs={6} md={4} lg={3} key={item.name}>
                        <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                      </Column>
                    ))}
                  </Row>
                </CollapsibleBox>
                <CollapsibleBox
                  title="Other Considerations"
                  defaultClosed
                  subtitle={getSelectedCount(gearListOtherConsiderations, values)}
                >
                  <Row>
                    {gearListOtherConsiderations.map((item) => (
                      <Column xs={6} md={4} lg={3} key={item.name}>
                        <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                      </Column>
                    ))}
                  </Row>
                </CollapsibleBox>
                <FlexContainer justifyContent="space-between">
                  <p>
                    <Button
                      rightSpacer
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      isLoading={isLoading}
                      iconLeft={<FaCheckCircle />}
                    >
                      Update Item
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        navigate(-1);
                        trackEvent('Edit Gear Closet Item Cancel Click', { ...activeItem });
                      }}
                      color="text"
                    >
                      Cancel
                    </Button>
                  </p>
                  <p>
                    <Button
                      type="button"
                      onClick={() => {
                        setModalIsOpen(true);
                        setItemToBeDeleted(activeItem);
                      }}
                      color="danger"
                    >
                      Delete
                    </Button>
                  </p>
                </FlexContainer>
              </Form>
            )}
          </Formik>

          {itemToBeDeleted && (
            <Modal
              toggleModal={() => {
                setItemToBeDeleted(undefined);
                setModalIsOpen(false);
              }}
              isOpen={modalIsOpen}
            >
              <Heading>Are you sure?</Heading>
              <p>
                Are you sure you want to delete <strong>{itemToBeDeleted.name}</strong>? This action
                cannot be undone.
              </p>
              <Row>
                <Column xs={6}>
                  <Button
                    type="button"
                    onClick={() => {
                      setItemToBeDeleted(undefined);
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
                    onClick={() => deleteItem(itemToBeDeleted)}
                    block
                    color="danger"
                    iconLeft={<FaTrash />}
                  >
                    Delete
                  </Button>
                </Column>
              </Row>
            </Modal>
          )}
        </>
      )}
      {(!activeItem || !isLoaded) && <LoadingPage />}
    </PageContainer>
  );
};

export default GearClosetEditItem;
