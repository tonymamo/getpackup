import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import uniqBy from 'lodash/uniqBy';
import { FaCheckCircle, FaPlusSquare } from 'react-icons/fa';
import * as icons from 'react-icons/all';

import {
  Heading,
  PageContainer,
  Seo,
  Button,
  Row,
  Column,
  Modal,
  CollapsibleBox,
  HorizontalScroller,
  IconCheckbox,
  FlexContainer,
  Alert,
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
} from '@utils/gearListItemEnum';
import { TripType } from '@common/trip';
import usePersonalGear from '@hooks/usePersonalGear';
import trackEvent from '@utils/trackEvent';
import { IconWrapperLabel, IconCheckboxLabel } from '@components/IconCheckbox';
import { baseSpacer, doubleSpacer, sextupleSpacer, tripleSpacer } from '@styles/size';
import { lightGray } from '@styles/color';
import Skeleton from 'react-loading-skeleton';

type TripGeneratorProps = {
  id?: string; // reach router param
} & RouteComponentProps;

type FormValues = { [key: string]: boolean };

const initialValues: { [key: string]: boolean } = {};

const generateGearList = (values: FormValues, gear: any) => {
  const getValues = (list: typeof initialValues) =>
    Object.entries(list)
      .filter((entry) => entry[1])
      .map((key) => key[0]);

  const matches: Array<GearItemType> = [];
  const tagMatches: Array<string> = [];

  getValues(values).forEach((val) => {
    matches.push(...gear.filter((item: GearItemType) => item[val] === true));
    // for each activity selected, add a tag to the trip
    gearListActivities.filter((item) => item.name === val).map((i) => tagMatches.push(i.label));
  });

  const gearList = uniqBy(matches, 'name').map((item: GearItemType) => {
    return {
      name: item.name,
      isPacked: false,
      category: item.category,
      isEssential: Boolean(item.essential),
      quantity: 1,
      description: '',
      created: new Date(),
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

  const personalGear = usePersonalGear();

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
  ]);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [addNewCategoryModalIsOpen, setAddNewCategoryModalIsOpen] = useState(false);
  const [gearListType, setGearListType] = useState<GearListEnumType | Array<any>>([]);
  const [gearClosetCategoriesIsLoading, setGearClosetCategoriesIsLoading] = useState(false);

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  const onSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setIsLoading(true);
    const { gearList, tagMatches } = generateGearList(values, personalGear);

    const promises: Array<Promise<any>> = [];

    promises.push(
      firebase
        .firestore()
        .collection('trips')
        .doc(props.id)
        .update({
          tags: [...(activeTrip?.tags || []), ...tagMatches],
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
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully generated trip based on selections`,
          })
        );
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
    <li>
      <IconWrapperLabel
        onClick={() => {
          setGearListType(array);
          setAddNewCategoryModalIsOpen(true);
        }}
      >
        <FaPlusSquare size={tripleSpacer} color={lightGray} />
        <IconCheckboxLabel>Add New</IconCheckboxLabel>
      </IconWrapperLabel>
    </li>
  );

  const renderLoadingIcons = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={`loadingIcon${index}`}>
        <FlexContainer flexDirection="column" style={{ margin: doubleSpacer }}>
          <Skeleton count={1} width={tripleSpacer} height={tripleSpacer} />
          <Skeleton count={1} width={sextupleSpacer} height={baseSpacer} />
        </FlexContainer>
      </li>
    ));
  };

  const renderDynamicIcon = (comboName: string) => {
    const [, iconName] = comboName.split('/');
    const Icon = icons[iconName];
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
      <Formik<FormValues> validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, isValid, values }) => (
          <Form>
            <Heading altStyle as="h1" noMargin align="center">
              Tell us about your trip!
            </Heading>
            <p style={{ textAlign: 'center' }}>
              Select the categories below that apply to this trip so we can make a custom packing
              list for you from all the gear in your gear closet.
            </p>
            <CollapsibleBox
              title="Activities"
              subtitle="What activities are you doing on this trip?"
            >
              <HorizontalScroller withBorder>
                {isLoaded(fetchedGearCloset) || gearClosetCategoriesIsLoading
                  ? getFilteredCategories(gearListActivities).map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))
                  : renderLoadingIcons()}
                {getOtherCategories(gearListActivities).length !== 0 &&
                  renderAddCategoryButton(gearListActivities)}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox title="Accommodations" subtitle="Where are you staying on this trip?">
              <HorizontalScroller withBorder>
                {isLoaded(fetchedGearCloset) || gearClosetCategoriesIsLoading
                  ? getFilteredCategories(gearListAccommodations).map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))
                  : renderLoadingIcons()}
                {getOtherCategories(gearListAccommodations).length !== 0 &&
                  renderAddCategoryButton(gearListAccommodations)}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox
              title="Camp Kitchen"
              subtitle="What type of kitchen setup(s) do will you need on this trip?"
            >
              <HorizontalScroller withBorder>
                {isLoaded(fetchedGearCloset) || gearClosetCategoriesIsLoading
                  ? getFilteredCategories(gearListCampKitchen).map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))
                  : renderLoadingIcons()}
                {getOtherCategories(gearListCampKitchen).length !== 0 &&
                  renderAddCategoryButton(gearListCampKitchen)}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox
              title="Other Considerations"
              subtitle="What other things might you need to bring on this trip?"
            >
              <HorizontalScroller withBorder>
                {/* remove '10 essentials' category, the last item in the array */}
                {isLoaded(fetchedGearCloset) || gearClosetCategoriesIsLoading
                  ? getFilteredCategories([...gearListOtherConsiderations.slice(0, -1)]).map(
                      (item) => (
                        <li key={item.name}>
                          <Field
                            as={IconCheckbox}
                            icon={item.icon}
                            checked={values[item.name] ?? false}
                            name={item.name}
                            label={item.label}
                          />
                        </li>
                      )
                    )
                  : renderLoadingIcons()}
                {getOtherCategories([...gearListOtherConsiderations.slice(0, -1)]).length !== 0 &&
                  renderAddCategoryButton(gearListOtherConsiderations)}
              </HorizontalScroller>
            </CollapsibleBox>

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
          </Form>
        )}
      </Formik>

      <Modal toggleModal={() => {}} isOpen={isLoading}>
        <Heading>Generating packing list...</Heading>
        {/* TODO: loading animation? */}
        <p>
          Please hold tight while we create a custom packing list for you based on your selections!
        </p>
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
          message="
          Note: this will add new gear to your gear closet that you may want to customize later!"
        />
        <strong style={{ textTransform: 'uppercase' }}>Select a Category</strong>
        <HorizontalScroller withBorder>
          {getOtherCategories(gearListType).map((item) => (
            <li key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </li>
          ))}
        </HorizontalScroller>
      </Modal>
    </PageContainer>
  );
};

export default TripGenerator;
