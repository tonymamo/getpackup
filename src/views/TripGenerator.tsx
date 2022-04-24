import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { uniq, uniqBy } from 'lodash';
import { FaCheckCircle, FaPlusSquare } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { IconType } from 'react-icons';

import {
  Heading,
  PageContainer,
  Seo,
  Button,
  Row,
  Column,
  Modal,
  IconCheckbox,
  FlexContainer,
  Alert,
  Box,
  FormErrors,
  LoadingSpinner,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { ActivityTypes, GearItemType, GearListEnumType } from '@common/gearItem';
import {
  gearListActivities,
  gearListAccommodations,
  gearListOtherConsiderations,
  gearListKeys,
  gearListCampKitchen,
  allGearListItems,
} from '@utils/gearListItemEnum';
import { TripType } from '@common/trip';
import usePersonalGear from '@hooks/usePersonalGear';
import trackEvent from '@utils/trackEvent';
import { IconWrapperLabel, IconCheckboxLabel } from '@components/IconCheckbox';
import { baseSpacer, doubleSpacer, sextupleSpacer, tripleSpacer } from '@styles/size';
import { lightGray } from '@styles/color';
import { UserType } from '@common/user';

type TripGeneratorProps = {
  id?: string; // reach router param
  loggedInUser: UserType;
} & RouteComponentProps;

type FormValues = { [key: string]: boolean };

const generateGearList = (
  values: FormValues,
  gear: any,
  uid: string,
  initialValues: { [key: string]: boolean }
) => {
  const getValues = (list: typeof initialValues) =>
    Object.entries(list)
      .filter((entry) => entry[1])
      .map((key) => key[0]);

  const matches: Array<GearItemType> = [];
  const tagMatches: Array<string> = [];

  getValues(values).forEach((val) => {
    matches.push(...gear.filter((item: GearItemType) => item[val] === true));
    // for each option selected, add a tag to the trip
    allGearListItems.filter((item) => item.name === val).map((i) => tagMatches.push(i.label));
  });

  const gearList = uniqBy(matches, 'name').map((item: GearItemType) => {
    // we dont just destructure `item` here because it contains all of the boolean values for
    // all of the tags, which is overkill and not needing in the packing list itself
    return {
      name: item.name,
      category: item.category,
      isPacked: false,
      isEssential: Boolean(item.essential),
      quantity: item.quantity || 1,
      description: item.description || '',
      weight: item.weight || '',
      weightUnit: item.weightUnit || '',
      created: new Date(),
      packedBy: [
        {
          isShared: false,
          quantity: 1,
          uid,
        },
      ],
    };
  });

  return { gearList, tagMatches };
};

const TripGenerator: FunctionComponent<TripGeneratorProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);

  const gearClosetCategories: Array<keyof ActivityTypes> = fetchedGearCloset?.[0]?.categories ?? [];

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  const personalGear = usePersonalGear();

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [addNewCategoryModalIsOpen, setAddNewCategoryModalIsOpen] = useState(false);
  const [gearListType, setGearListType] = useState<GearListEnumType | Array<any>>([]);
  const [gearClosetCategoriesIsLoading, setGearClosetCategoriesIsLoading] = useState(false);

  const initialValues: { [key: string]: boolean } = {};

  allGearListItems.forEach((item) => {
    initialValues[item.name] = activeTrip?.tags.some((i) => i === item.label) || false;
  });

  const onSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setIsLoading(true);
    const { gearList, tagMatches } = generateGearList(
      values,
      personalGear,
      auth.uid,
      initialValues
    );

    const promises: Array<Promise<any>> = [];

    const uniqueTags = uniq([...(activeTrip?.tags || []), ...tagMatches]);

    promises.push(
      firebase
        .firestore()
        .collection('trips')
        .doc(props.id)
        .update({
          tags: uniqueTags,
        })
    );

    gearList.forEach((item) => {
      promises.push(
        firebase
          .firestore()
          .collection('trips')
          .doc(props.id)
          .collection('packing-list')
          .add(item)
      );
    });

    Promise.all(promises)
      .then(() => {
        navigate(`/app/trips/${props.id}`);
        trackEvent('Trip Generated Successfully', { tripId: props.id });
      })
      .catch((err) => {
        trackEvent('Trip Generation Failure', { tripId: props.id, error: err });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
    setSubmitting(false);
  };

  // TODO check if generator has been completed already in case someone tries to navigate back using
  // browser controls, and either initialize fields with selections and make sure not to overwrite
  // packing list items, or maybe just forward them to a different screen?

  // the categories that the user DOES have in their gear closet, so we can only show those
  const getFilteredCategories = (array: GearListEnumType) =>
    array.filter((item) => gearClosetCategories.includes(item.name));

  // the categories that the user DOES NOT have in the gear closet
  // also remove "essential" because that will always exist for users
  const getOtherCategories = (array: GearListEnumType) =>
    array.filter((item) => !gearClosetCategories.includes(item.name) && item.name !== 'essential');

  const renderAddCategoryButton = (array: GearListEnumType) => (
    <Column xs={4} md={3}>
      <IconWrapperLabel
        onClick={() => {
          setGearListType(array);
          setAddNewCategoryModalIsOpen(true);
        }}
      >
        <FaPlusSquare size={tripleSpacer} color={lightGray} />
        <IconCheckboxLabel>Add New</IconCheckboxLabel>
      </IconWrapperLabel>
    </Column>
  );

  const renderLoadingIcons = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`loadingIcon${index}`}>
        <FlexContainer flexDirection="column" style={{ margin: doubleSpacer }}>
          <Skeleton count={1} width={tripleSpacer} height={tripleSpacer} />
          <Skeleton count={1} width={sextupleSpacer} height={baseSpacer} />
        </FlexContainer>
      </div>
    ));
  };

  const renderDynamicIcon = (icon: IconType) => {
    const Icon = icon;
    return <Icon color={lightGray} size={tripleSpacer} />;
  };

  const updateUsersGearClosetCategories = (categoryToAdd: string) => {
    setGearClosetCategoriesIsLoading(true);
    setAddNewCategoryModalIsOpen(false);
    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        categories: firebase.firestore.FieldValue.arrayUnion(categoryToAdd),
      })
      .then(() => {
        setGearClosetCategoriesIsLoading(false);
      })
      .catch((err) => {
        setGearClosetCategoriesIsLoading(false);
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  return (
    <PageContainer>
      <Seo title="Trip Generator" />
      {activeTrip && (
        <Formik<FormValues>
          validateOnMount
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={(values) => {
            const numberOfCheckedCategories = Object.keys(values)
              .filter((valueKey) => gearListKeys.includes(valueKey as keyof ActivityTypes))
              .filter((item) => values[item] === true).length;
            return numberOfCheckedCategories === 0
              ? {
                  selectOne: 'You must select at least one item from any section before proceeding',
                }
              : {};
          }}
        >
          {({ isSubmitting, isValid, errors, values }) => (
            <Form>
              <Row>
                <Column md={8} mdOffset={2}>
                  <Heading altStyle as="h1" align="center">
                    Tell us about your trip!
                  </Heading>
                  <p style={{ textAlign: 'center' }}>
                    <small>
                      Select the categories below that apply to this trip so we can make a custom
                      packing list for you from all the gear in your gear closet.
                    </small>
                  </p>
                  {activeTrip && activeTrip.owner !== props.loggedInUser.uid && (
                    <Alert
                      type="info"
                      message="We've pre-selected some options based on the existing trip details!"
                    />
                  )}
                  <div>
                    <Box>
                      <Heading as="h3" altStyle noMargin>
                        Activities
                      </Heading>

                      <p style={{ margin: '0 0 8px 0', lineHeight: 1 }}>
                        <small>What activities are you doing on this trip?</small>
                      </p>

                      <Row>
                        {isLoaded(fetchedGearCloset) || !gearClosetCategoriesIsLoading
                          ? getFilteredCategories(gearListActivities).map((item) => (
                              <Column xs={4} md={3} key={item.name}>
                                <Field
                                  as={IconCheckbox}
                                  icon={item.icon}
                                  checked={values[item.name] ?? false}
                                  name={item.name}
                                  label={item.label}
                                />
                              </Column>
                            ))
                          : renderLoadingIcons()}
                        {getOtherCategories(gearListActivities).length !== 0 &&
                          renderAddCategoryButton(gearListActivities)}
                      </Row>
                    </Box>
                  </div>
                  <div>
                    <Box>
                      <Heading as="h3" altStyle noMargin>
                        Accommodations
                      </Heading>

                      <p style={{ margin: '0 0 8px 0', lineHeight: 1 }}>
                        <small>Where are you staying on this trip?</small>
                      </p>
                      <Row>
                        {isLoaded(fetchedGearCloset) || !gearClosetCategoriesIsLoading
                          ? getFilteredCategories(gearListAccommodations).map((item) => (
                              <Column xs={4} md={3} key={item.name}>
                                <Field
                                  as={IconCheckbox}
                                  icon={item.icon}
                                  checked={values[item.name] ?? false}
                                  name={item.name}
                                  label={item.label}
                                />
                              </Column>
                            ))
                          : renderLoadingIcons()}
                        {getOtherCategories(gearListAccommodations).length !== 0 &&
                          renderAddCategoryButton(gearListAccommodations)}
                      </Row>
                    </Box>
                  </div>
                  <div>
                    <Box>
                      <Heading as="h3" altStyle noMargin>
                        Camp Kitchen
                      </Heading>

                      <p style={{ margin: '0 0 8px 0', lineHeight: 1 }}>
                        <small>What type of kitchen setup(s) do will you need on this trip?</small>
                      </p>
                      <Row>
                        {isLoaded(fetchedGearCloset) || !gearClosetCategoriesIsLoading
                          ? getFilteredCategories(gearListCampKitchen).map((item) => (
                              <Column xs={4} md={3} key={item.name}>
                                <Field
                                  as={IconCheckbox}
                                  icon={item.icon}
                                  checked={values[item.name] ?? false}
                                  name={item.name}
                                  label={item.label}
                                />
                              </Column>
                            ))
                          : renderLoadingIcons()}
                        {getOtherCategories(gearListCampKitchen).length !== 0 &&
                          renderAddCategoryButton(gearListCampKitchen)}
                      </Row>
                    </Box>
                  </div>
                  <div>
                    <Box>
                      <Heading as="h3" altStyle noMargin>
                        Other Considerations
                      </Heading>

                      <p style={{ margin: '0 0 8px 0', lineHeight: 1 }}>
                        <small>What other things might you need to bring on this trip?</small>
                      </p>
                      <Row>
                        {/* remove '10 essentials' category, the last item in the array */}
                        {isLoaded(fetchedGearCloset) || !gearClosetCategoriesIsLoading
                          ? getFilteredCategories([
                              ...gearListOtherConsiderations.slice(0, -1),
                            ]).map((item) => (
                              <Column xs={4} md={3} key={item.name}>
                                <Field
                                  as={IconCheckbox}
                                  icon={item.icon}
                                  checked={values[item.name] ?? false}
                                  name={item.name}
                                  label={item.label}
                                />
                              </Column>
                            ))
                          : renderLoadingIcons()}
                        {getOtherCategories([...gearListOtherConsiderations.slice(0, -1)])
                          .length !== 0 && renderAddCategoryButton(gearListOtherConsiderations)}
                      </Row>
                    </Box>
                  </div>
                  <FormErrors dirty errors={errors} />
                  <Row>
                    <Column xs={6} xsOffset={6}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        isLoading={isLoading}
                        block
                        color="success"
                        iconLeft={<FaCheckCircle />}
                      >
                        {isLoading ? 'Saving' : 'Save'}
                      </Button>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Form>
          )}
        </Formik>
      )}

      <Modal toggleModal={() => {}} isOpen={isLoading} hideCloseButton largePadding>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner theme="dark" />
          <Heading>Generating packing list...</Heading>

          <p>
            Please hold tight while we create a custom packing list for you based on your selections
            📝
          </p>
        </div>
      </Modal>

      <Modal
        toggleModal={() => {
          setGearListType([]);
          setAddNewCategoryModalIsOpen(false);
        }}
        isOpen={addNewCategoryModalIsOpen}
      >
        <Heading>Add New Category</Heading>
        <Alert
          type="info"
          message="Note: selecting a new tag will pre-populate new gear in your gear closet that you may want to customize after!"
        />
        <strong style={{ textTransform: 'uppercase' }}>Select a Category</strong>
        <Row>
          {getOtherCategories(gearListType).map((item) => (
            <Column xs={4} md={3} key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </Column>
          ))}
        </Row>
      </Modal>
    </PageContainer>
  );
};

export default TripGenerator;
