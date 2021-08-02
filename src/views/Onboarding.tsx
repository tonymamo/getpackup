import React, { FunctionComponent, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FaCheck, FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import pickBy from 'lodash/pickBy';
import styled from 'styled-components';

import {
  Button,
  Column,
  FlexContainer,
  Heading,
  PageContainer,
  Row,
  Seo,
  IconCheckbox,
  HorizontalRule,
  FormErrors,
  InlineLoader,
} from '@components';
import { halfSpacer } from '@styles/size';
import { textColor, textColorLight } from '@styles/color';
import {
  gearListActivities,
  gearListAccommodations,
  gearListOtherConsiderations,
  gearListKeys,
  gearListCampKitchen,
} from '@utils/gearListItemEnum';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import { addAlert } from '@redux/ducks/globalAlerts';
import { ActivityTypes } from '@common/gearItem';
import GearClosetIcon from '@images/gearClosetIcon';
import { Link } from 'gatsby';

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

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: { [key: string]: boolean } = {};

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

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
    <FlexContainer>
      <FaCircle
        style={{ margin: halfSpacer }}
        color={activeTab === 0 ? textColor : textColorLight}
        onClick={() => onSwitch(0)}
      />
      <FaCircle
        style={{ margin: halfSpacer }}
        color={activeTab === 1 ? textColor : textColorLight}
        onClick={() => onSwitch(1)}
      />
      <FaCircle
        style={{ margin: halfSpacer }}
        color={activeTab === 2 ? textColor : textColorLight}
        onClick={() => onSwitch(2)}
      />
      <FaCircle
        style={{ margin: halfSpacer }}
        color={activeTab === 3 ? textColor : textColorLight}
        onClick={() => onSwitch(3)}
      />
    </FlexContainer>
  );

  return (
    <PageContainer>
      <Seo title="Let's Get Started" />
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
                        What types of activities do you like to do? We will use your answers to
                        create a <strong>custom gear closet</strong> for you.
                      </p>
                      <p>
                        <small>
                          <em>
                            Select all that apply. Don&apos;t see your favorite activity? You will
                            have a chance to add it later.
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

                    <FlexContainer justifyContent="flex-end">
                      <Button
                        type="button"
                        onClick={() => onSwitch(1)}
                        iconRight={<FaChevronRight />}
                      >
                        Next
                      </Button>
                    </FlexContainer>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      <Heading>Accommodations</Heading>
                      <p>When you go on adventures, what types of accommodations do you stay in?</p>
                      <p>
                        <small>
                          <em>Select all that apply.</em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {gearListAccommodations.map((item) => (
                        <Column xs={6} sm={4} md={3} key={item.name}>
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
                      <p>Related, what type of kitchen setup(s) do you have gear for?</p>
                      <p>
                        <small>
                          <em>Select all that apply.</em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {gearListCampKitchen.map((item) => (
                        <Column xs={6} sm={4} md={3} key={item.name}>
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

                    <FlexContainer justifyContent="space-between">
                      <Button
                        type="button"
                        color="text"
                        onClick={() => onSwitch(0)}
                        iconLeft={<FaChevronLeft />}
                      >
                        Forgot something?
                      </Button>
                      <Button
                        type="button"
                        onClick={() => onSwitch(2)}
                        iconRight={<FaChevronRight />}
                      >
                        Next
                      </Button>
                    </FlexContainer>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      <Heading>Miscellaneous</Heading>
                      <p>
                        What other stuff are you into, or need to remember to bring on your trips?
                        We can help you pack those items too 😎
                      </p>
                      <p>
                        <small>
                          <em>
                            Select all that apply. You can add more categories and custom items
                            later.
                          </em>
                        </small>
                      </p>
                    </CenteredText>

                    <Row>
                      {/* remove '10 essentials' category, the last item in the array */}
                      {[...gearListOtherConsiderations.slice(0, -1)].map((item) => (
                        <Column xs={6} sm={4} md={3} key={item.name}>
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
                    <FlexContainer justifyContent="space-between">
                      <Button
                        type="button"
                        color="text"
                        onClick={() => onSwitch(1)}
                        iconLeft={<FaChevronLeft />}
                      >
                        Wait, go back
                      </Button>
                      <Button
                        type="button"
                        color="success"
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
                    </FlexContainer>
                    {renderPageIndicators()}
                  </Slide>
                  <Slide>
                    <CenteredText>
                      {isLoading ? (
                        <>
                          <InlineLoader />
                          <Heading>Please Wait</Heading>
                          <p>We are building out your personalized gear closet.</p>
                        </>
                      ) : (
                        <>
                          <Heading>Success!</Heading>
                          <p>
                            We just built out your personalized gear closet. Now we will use your
                            gear to create a <strong>dynamic packing list</strong> that is unique
                            for each trip, based on what you are doing on that trip. You can find
                            your gear closet by looking for{' '}
                            <Link
                              to="/app/gear-closet"
                              onClick={() =>
                                trackEvent('Gear Closet Button clicked', {
                                  location: 'Onboarding Finish Text',
                                })
                              }
                            >
                              the gear closet icon <GearClosetIcon size={15} />
                            </Link>
                            .
                          </p>
                          <br />
                          <Heading as="h2" altStyle>
                            You can now go create your first trip to see how it works, or go
                            customize your gear closet to your liking!
                          </Heading>
                          <br />
                          <br />
                          <Row>
                            <Column sm={6}>
                              <Button
                                type="link"
                                to="/app/gear-closet"
                                color="text"
                                block
                                onClick={() =>
                                  trackEvent('Gear Closet Button Clicked', {
                                    location: 'Onboarding Finish Button',
                                  })
                                }
                              >
                                Customize Gear Closet
                              </Button>
                            </Column>
                            <Column sm={6} xsSpacer>
                              <Button
                                type="link"
                                to="/app/trips/new"
                                iconRight={<FaChevronRight />}
                                block
                                onClick={() =>
                                  trackEvent('New Trip Button clicked', {
                                    location: 'Onboarding Finish Button',
                                  })
                                }
                              >
                                Create First Trip
                              </Button>
                            </Column>
                          </Row>
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
