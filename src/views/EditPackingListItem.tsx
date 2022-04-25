import React, { useEffect, useState, useRef, FunctionComponent } from 'react';
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
  Column,
  FlexContainer,
  Heading,
  HorizontalRule,
  Input,
  Modal,
  Row,
  Seo,
} from '@components';
import { PackingListItemType, PackedByUserType } from '@common/packingListItem';
import { requiredField, requiredSelect } from '@utils/validations';
import { gearListCategories } from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';
import useWindowSize from '@utils/useWindowSize';
import trackEvent from '@utils/trackEvent';
import scrollToPosition from '@utils/scrollToPosition';
import { UserType } from '@common/user';
import { TripType } from '@common/trip';
import { TabOptions } from '@utils/enums';
import acceptedTripMembersOnly from '@utils/getAcceptedTripMembersOnly';
import { RootState } from '@redux/ducks';

type EditPackingListItemProps = {
  tripId?: string;
  id?: string;
  users: { [key: string]: UserType };
  packingList: PackingListItemType[];
  loggedInUserUid: string;
  activeTrip?: TripType;
} & RouteComponentProps;

const EditPackingListItem: FunctionComponent<EditPackingListItemProps> = (props) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();

  const {
    activePackingListTab,
    personalListScrollPosition,
    sharedListScrollPosition,
  } = useSelector((state: RootState) => state.client);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const size = useWindowSize();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true; // Will set it to true on mount ...
    return () => {
      mounted.current = false; // ... and to false on unmount
    };
  }, []);

  const activeItem: PackingListItemType =
    props.packingList &&
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    props.packingList.find((item: PackingListItemType) => item.id === props.id)!;

  const removeItem = (isSharedItem: boolean) => {
    if (isSharedItem) {
      return setModalIsOpen(true);
    }
    if (activeItem && !isSharedItem) {
      return firebase
        .firestore()
        .collection('trips')
        .doc(props.tripId)
        .collection('packing-list')
        .doc(activeItem?.id)
        .delete()
        .then(() => {
          trackEvent('Packing List Item Removed', { ...activeItem });
          navigate(-1);
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
    return null;
  };

  const handleReturn = (): void => {
    if (personalListScrollPosition || sharedListScrollPosition) {
      scrollToPosition(
        activePackingListTab === TabOptions.Personal
          ? personalListScrollPosition
          : sharedListScrollPosition
      );
    }
    navigate(-1);
  };

  return (
    <div>
      <Seo title="Edit Item" />
      {!size.isSmallScreen && (
        <Button
          type="button"
          onClick={() => handleReturn()}
          color="text"
          iconLeft={<FaChevronLeft />}
        >
          Back
        </Button>
      )}
      {activeItem ? (
        <Formik
          validateOnMount
          initialValues={
            {
              ...activeItem,
              packedBy: activeItem.packedBy.map((member) => member.uid),
              isSharedItem: activeItem.packedBy.some((item) => item.isShared),
            } as Omit<PackingListItemType, 'packedBy'> & {
              isSharedItem?: boolean;
              packedBy: string[];
            }
          }
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const updateValues = {
              ...values,
              quantity: Number(values.quantity),
              // if it is a sharedItem, map over all the users. If not shared, assign to just one user
              packedBy: values.isSharedItem
                ? values.packedBy.map((user) => {
                    // initialize obj shape and just set quantity to 1 for now, since not sure if we are
                    // going to use it per user or just the quantity field on the line above
                    const obj: PackedByUserType = { uid: '', quantity: 1, isShared: false };
                    // add in the user uid from values
                    obj.uid = user;
                    // if values.isSharedItem is true, then set all to true in the map
                    obj.isShared = true;
                    return obj;
                  })
                : [
                    {
                      // TODO: defaulting logged in user, but could also do first person in list of values.packedBy[0]?
                      uid: props.loggedInUserUid,
                      isShared: false,
                      quantity: 1,
                    },
                  ],
            };

            // dont need to send this value along, its just for use on this page to handle the Toggle
            delete updateValues.isSharedItem;

            if (activeItem) {
              firebase
                .firestore()
                .collection('trips')
                .doc(props.tripId)
                .collection('packing-list')
                .doc(activeItem?.id)
                .update(updateValues)
                .then(() => {
                  resetForm({
                    values: {
                      ...updateValues,
                      packedBy: updateValues.packedBy.map((member) => member.uid),
                      isSharedItem: updateValues.packedBy.some((item) => item.isShared),
                    },
                  });
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
              if (mounted.current) {
                setSubmitting(false);
              }
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting, ...rest }) => (
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
              <Row>
                <Column sm={6}>
                  <Field
                    as={Input}
                    type="text"
                    name="name"
                    label="Name"
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
              </Row>

              <Field as={Input} type="textarea" name="description" label="Description" />
              <Row>
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
                          {
                            value: 'g',
                            label: 'g',
                          },
                          {
                            value: 'kg',
                            label: 'kg',
                          },
                          {
                            value: 'oz',
                            label: 'oz',
                          },
                          {
                            value: 'lb',
                            label: 'lb',
                          },
                        ]}
                        setFieldValue={setFieldValue}
                        {...rest}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>

              <Row>
                <Column xs={5} sm={4} md={3}>
                  <Field
                    as={Input}
                    type="toggle"
                    name="isSharedItem"
                    label="Shared Group Item"
                    checked={values.isSharedItem}
                  />
                </Column>
                {values.isSharedItem && props.activeTrip && Object.keys(props.users).length > 0 && (
                  <Column xs={7} sm={8} md={9}>
                    <Field
                      as={Input}
                      type="select"
                      name="packedBy"
                      label="Packed By"
                      isMulti
                      required
                      validate={requiredSelect}
                      options={Object.values(acceptedTripMembersOnly(props.activeTrip)).map(
                        (member) => {
                          const matchingUser: UserType = props.users && props.users[member.uid];
                          const obj = {
                            value: '',
                            label: '',
                          };
                          obj.value = member.uid;
                          obj.label = matchingUser?.username.toLocaleLowerCase();
                          return obj;
                        }
                      )}
                      setFieldValue={setFieldValue}
                      {...rest}
                    />
                  </Column>
                )}
              </Row>
              {/* <Button
                type="submit"
                // onClick={() => {
                //   handleReturn();
                //   trackEvent('Edit Packing List Item Cancel Click');
                // }}
                color="success"
                disabled={isSubmitting || !isValid}
                iconLeft={<FaCheck />}
              >
                Save
              </Button> */}

              <AutoSave />

              <HorizontalRule />
              <FlexContainer justifyContent="space-between">
                <Button
                  type="button"
                  onClick={() => {
                    handleReturn();
                    trackEvent('Edit Packing List Item Cancel Click');
                  }}
                  color="text"
                  iconLeft={<FaChevronLeft />}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => removeItem(values.packedBy.length > 1)}
                  color="danger"
                  iconLeft={<FaTrash />}
                >
                  Remove Item
                </Button>
              </FlexContainer>
            </Form>
          )}
        </Formik>
      ) : (
        <FlexContainer height="30vh">
          <p>Select an item to edit</p>
        </FlexContainer>
      )}

      <Modal
        toggleModal={() => {
          setModalIsOpen(false);
        }}
        isOpen={modalIsOpen}
      >
        <Heading as="h3">Cannot remove item</Heading>
        <p>
          Sorry, you cannot remove an item if multiple people are sharing it. Switch the{' '}
          <strong>Shared Group Item</strong> toggle to{' '}
          <em>
            <strong>No</strong>
          </em>{' '}
          and then try again.
        </p>
        <Button type="button" onClick={() => setModalIsOpen(false)} color="secondary">
          Got it 👍
        </Button>
      </Modal>
    </div>
  );
};

export default EditPackingListItem;
