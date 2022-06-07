import { ActivityTypes } from '@common/gearItem';
import {
  Button,
  Column,
  FlexContainer,
  FormErrors,
  Heading,
  HorizontalRule,
  IconCheckbox,
  InlineLoader,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { textColor, textColorLight } from '@styles/color';
import { doubleSpacer, halfSpacer } from '@styles/size';
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListKeys,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import trackEvent from '@utils/trackEvent';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { navigate } from 'gatsby';
import pickBy from 'lodash/pickBy';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FaCheck, FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { isLoaded, useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

type OnboardingProps = {};

const Slide = styled.div`
  height: 100%;
`;

const CenteredText = styled.div`
  text-align: center;
`;

const Onboarding: FunctionComponent<OnboardingProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);

  useFirestoreConnect([
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: { [key: string]: boolean } = {};

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  useEffect(() => {
    if (isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0) {
      navigate('/app/gear-closet');
    }
  }, []);

  const onSubmit = (
    values: typeof initialValues,
    { resetForm, setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setIsLoading(true);

    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .set({
        categories: Object.keys(pickBy(values, (val) => val === true)),
        owner: auth.uid,
        id: auth.uid,
        removals: [],
      })
      .then(() => {
        resetForm();
        // navigate('/app/gear-closet');
        trackEvent('Gear Closet Generation Successfully Completed', { values });
      })
      .catch((error: Error) => {
        trackEvent('Gear Closet Generation Failed', { values, error });
        dispatch(
          addAlert({
            type: 'danger',
            message: 'Failed to create your closet, please try again.',
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
        setSubmitting(false);
      });
  };

  const onSwitch = (index: number) => {
    setActiveTab(index);
    window.scrollTo(0, 0);
  };

  const renderPageIndicators = () => (
    <div style={{ marginTop: doubleSpacer }}>
      <FlexContainer>
        <FaCircle
          style={{ margin: halfSpacer }}
          color={activeTab === 0 ? textColor : textColorLight}
        />
        <FaCircle
          style={{ margin: halfSpacer }}
          color={activeTab === 1 ? textColor : textColorLight}
        />
        <FaCircle
          style={{ margin: halfSpacer }}
          color={activeTab === 2 ? textColor : textColorLight}
        />
        <FaCircle
          style={{ margin: halfSpacer }}
          color={activeTab === 3 ? textColor : textColorLight}
        />
      </FlexContainer>
    </div>
  );

  return (
    <PageContainer>
      <Seo title="Initial Account Setup" />
      <Formik
        validateOnMount
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => {
          const numberOfCheckedCategories = Object.keys(values)
            .filter((valueKey) => gearListKeys.includes(valueKey as keyof ActivityTypes))
            .filter((item) => values[item] === true).length;
          return numberOfCheckedCategories === 0
            ? {
                selectOne:
                  'You must select at least one category from any section before proceeding',
              }
            : {};
        }}
      >
        {({ isSubmitting, isValid, values, errors, handleSubmit }) => (
          <Form>
            <Row>
              <Column md={8} mdOffset={2}>
                <SwipeableViews
                  index={activeTab}
                  disabled
                  slideStyle={{ overflowX: 'hidden', padding: 8 }}
                >
                  <Slide>
                    <CenteredText>
                      <Heading>Welcome! 🤝</Heading>
                      <p>
                        We are glad you are here. Let&apos;s set up your account. Tell us all the
                        activities you&apos;re interested in doing.
                      </p>
                      <p>
                        <small>
                          <em>
                            Select all that apply.
                            {/* TODO: add back when we have custom categories */}
                            {/* Don&apos;t see your favorite activity? You will
                            have a chance to add it later. */}
                          </em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {gearListActivities.map((item) => (
                        <Column xs={4} md={3} key={item.name}>
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

                    <Row>
                      <Column sm={6} smOffset={6}>
                        <Button
                          type="button"
                          block
                          onClick={() => onSwitch(1)}
                          iconRight={<FaChevronRight />}
                        >
                          Next
                        </Button>
                      </Column>
                    </Row>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      <Heading>Accommodations</Heading>
                      <p>What types of accommodations do you stay in?</p>
                      <p>
                        <small>
                          <em>Select all that apply.</em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {gearListAccommodations.map((item) => (
                        <Column xs={4} md={3} key={item.name}>
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
                    <HorizontalRule />
                    <CenteredText>
                      <Heading>Kitchen</Heading>
                      <p>What kinds of setups will you need on your trips?</p>
                      <p>
                        <small>
                          <em>Select all that apply.</em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {gearListCampKitchen.map((item) => (
                        <Column xs={4} md={3} key={item.name}>
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

                    <Row>
                      <Column sm={6} xsSpacer smOrder={2}>
                        <Button
                          type="button"
                          block
                          onClick={() => onSwitch(2)}
                          iconRight={<FaChevronRight />}
                        >
                          Next
                        </Button>
                      </Column>
                      <Column sm={6} smOrder={1}>
                        <Button
                          type="button"
                          color="text"
                          block
                          onClick={() => onSwitch(0)}
                          iconLeft={<FaChevronLeft />}
                        >
                          Go Back
                        </Button>
                      </Column>
                    </Row>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      <Heading>Other Considerations</Heading>
                      <p>
                        Sometimes trips need additional items. Select those that are important to
                        you.
                      </p>
                      <p>
                        <small>
                          <em>Select all that apply. You can always add custom items later.</em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {/* remove '10 essentials' category, the last item in the array */}
                      {[...gearListOtherConsiderations.slice(0, -1)].map((item) => (
                        <Column xs={4} md={3} key={item.name}>
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
                    <FormErrors dirty errors={errors} />
                    <Row>
                      <Column sm={6} xsSpacer smOrder={2}>
                        <Button
                          type="button"
                          color="success"
                          block
                          isLoading={isLoading}
                          disabled={isSubmitting || !isValid}
                          onClick={() => {
                            onSwitch(3);
                            handleSubmit();
                          }}
                          iconLeft={<FaCheck />}
                        >
                          Finish
                        </Button>
                      </Column>
                      <Column sm={6}>
                        <Button
                          type="button"
                          color="text"
                          block
                          onClick={() => onSwitch(1)}
                          iconLeft={<FaChevronLeft />}
                        >
                          Go Back
                        </Button>
                      </Column>
                    </Row>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      {isLoading ? (
                        <>
                          <InlineLoader />
                          <Heading>Please Wait</Heading>
                          <p>We are setting up your account.</p>
                        </>
                      ) : (
                        <>
                          <Heading>Success!</Heading>
                          <p>
                            We have personalized your account for your interests, and have set up
                            your inventory of packing list recommendations for your trips.
                          </p>
                          <br />
                          <Heading as="h2" altStyle>
                            Let&apos;s get started by making your first trip!
                          </Heading>
                          <br />
                          <br />

                          <Button
                            type="link"
                            to="/app/trips/new"
                            iconRight={<FaChevronRight />}
                            onClick={() =>
                              trackEvent('New Trip Button clicked', {
                                location: 'Onboarding Finish Button',
                              })
                            }
                          >
                            Create First Trip
                          </Button>
                        </>
                      )}
                    </CenteredText>
                  </Slide>
                </SwipeableViews>
              </Column>
            </Row>
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default Onboarding;
