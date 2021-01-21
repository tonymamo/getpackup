import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Formik, Form, Field } from 'formik';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import uniqBy from 'lodash/uniqBy';
import SwipeableViews from 'react-swipeable-views';
import { FaCaretLeft, FaCaretRight, FaCheckCircle } from 'react-icons/fa';

import {
  Heading,
  PageContainer,
  Seo,
  Button,
  IconCheckbox,
  Row,
  Column,
  FlexContainer,
  Modal,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { GearItem } from '@common/gearItem';
import {
  gearListActivities,
  gearListAccommodations,
  gearListOtherConsiderations,
  gearListKeys,
  allGearListItems,
  gearListCampKitchen,
} from '@utils/gearListItemEnum';
import { TripType } from '@common/trip';

type TripGeneratorProps = {
  id?: string; // reach router param
} & RouteComponentProps;

const TripGenerator: FunctionComponent<TripGeneratorProps> = (props) => {
  const gear = useSelector((state: RootState) => state.firestore.ordered.gear);
  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );
  useFirestoreConnect([
    { collection: 'gear' },
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
  ]);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: { [key: string]: boolean } = {};

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  // TODO check if generator has been completed already in case someone tries to navigate back using
  // browser controls, and either initialize fields with selections and make sure not to overwrite
  // packing list items, or maybe just forward them to a different screen?

  return (
    <PageContainer>
      <Seo title="Trip Generator" />
      <Formik
        validateOnMount
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setIsLoading(true);
          const getValues = (list: typeof initialValues) =>
            Object.entries(list)
              .filter((entry) => entry[1])
              .map((key) => key[0]);

          const matches: Array<GearItem> = [];
          const tagMatches: Array<string> = [];

          getValues(values).forEach((val) => {
            matches.push(...gear.filter((item: GearItem) => item[val] === true));
            tagMatches.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              allGearListItems.find((item: { name: string; label: string }) => item.name === val)
                ?.label!
            );
          });

          const generatedPackingList = uniqBy(matches, 'name').map((item: GearItem) => {
            return {
              name: item.name,
              isPacked: false,
              category: item.category,
              isEssential: Boolean(item.essential),
            };
          });

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

          generatedPackingList.forEach((item) => {
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
              dispatch(
                addAlert({
                  type: 'success',
                  message: `Successfully generated trip based on selections`,
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
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, values }) => (
          <Form>
            <p>
              <small>
                Select all that apply so we can pre-populate your packing list. Missing an option?
                That&apos;s ok, you can add it later.
              </small>
            </p>
            <SwipeableViews index={activeTab} onChangeIndex={(i) => setActiveTab(i)}>
              <div>
                <FlexContainer flexDirection="column" justifyContent="space-between" height="100%">
                  <div>
                    <Heading altStyle as="h2" noMargin align="center">
                      Activities
                    </Heading>
                    <Row>
                      {gearListActivities.map((item) => (
                        <Column xs={4} md={2} key={item.name}>
                          <Field
                            as={IconCheckbox}
                            icon={item.icon}
                            checked={values[item.name] ?? false}
                            name={item.name}
                            label={item.label}
                          />
                        </Column>
                      ))}
                    </Row>
                  </div>
                  <div style={{ width: '100%' }}>
                    <Row>
                      <Column xs={6} xsOffset={6}>
                        <Button
                          type="button"
                          onClick={() => setActiveTab(1)}
                          block
                          iconRight={<FaCaretRight />}
                        >
                          Next
                        </Button>
                      </Column>
                    </Row>
                  </div>
                </FlexContainer>
              </div>
              <div>
                <FlexContainer flexDirection="column" justifyContent="space-between" height="100%">
                  <div>
                    <Heading altStyle as="h2" noMargin align="center">
                      Accommodations
                    </Heading>
                    <Row>
                      {gearListAccommodations.map((item) => (
                        <Column xs={4} md={2} key={item.name}>
                          <Field
                            as={IconCheckbox}
                            icon={item.icon}
                            checked={values[item.name] ?? false}
                            name={item.name}
                            label={item.label}
                          />
                        </Column>
                      ))}
                    </Row>
                    <Heading altStyle as="h2" noMargin align="center">
                      Camp Kitchen
                    </Heading>

                    <Row>
                      {gearListCampKitchen.map((item) => (
                        <Column xs={4} md={2} key={item.name}>
                          <Field
                            as={IconCheckbox}
                            icon={item.icon}
                            checked={values[item.name] ?? false}
                            name={item.name}
                            label={item.label}
                          />
                        </Column>
                      ))}
                    </Row>
                  </div>
                  <div style={{ width: '100%' }}>
                    <Row>
                      <Column xs={6}>
                        <Button
                          type="button"
                          onClick={() => setActiveTab(0)}
                          color="primaryOutline"
                          block
                          iconLeft={<FaCaretLeft />}
                        >
                          Previous
                        </Button>
                      </Column>
                      <Column xs={6}>
                        <Button
                          type="button"
                          onClick={() => setActiveTab(2)}
                          block
                          iconRight={<FaCaretRight />}
                        >
                          Next
                        </Button>
                      </Column>
                    </Row>
                  </div>
                </FlexContainer>
              </div>
              <div>
                <FlexContainer flexDirection="column" justifyContent="space-between" height="100%">
                  <div>
                    <Heading altStyle as="h2" noMargin align="center">
                      Other Considerations
                    </Heading>
                    <Row>
                      {gearListOtherConsiderations
                        // filter out Essential as we will include them always
                        .filter((i) => i.name !== 'essential')
                        .map((item) => (
                          <Column xs={4} md={2} key={item.name}>
                            <Field
                              as={IconCheckbox}
                              icon={item.icon}
                              checked={values[item.name] ?? false}
                              name={item.name}
                              label={item.label}
                            />
                          </Column>
                        ))}
                    </Row>
                  </div>
                  <div style={{ width: '100%' }}>
                    <Row>
                      <Column xs={6}>
                        <Button
                          type="button"
                          onClick={() => setActiveTab(1)}
                          color="primaryOutline"
                          block
                          iconLeft={<FaCaretLeft />}
                        >
                          Previous
                        </Button>
                      </Column>
                      <Column xs={6}>
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
                  </div>
                </FlexContainer>
              </div>
            </SwipeableViews>
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
    </PageContainer>
  );
};

export default TripGenerator;
