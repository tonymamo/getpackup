import { MAX_TRIP_PARTY_SIZE } from '@common/constants';
import { TripFormType, TripMemberStatus } from '@common/trip';
import { UserType } from '@common/user';
import {
  Box,
  Button,
  Column,
  DayPickerInput,
  FlexContainer,
  FormErrors,
  Heading,
  HeroImageUpload,
  HorizontalRule,
  Input,
  PageContainer,
  Row,
  Seo,
  UserMediaObject,
  UserSearch,
} from '@components';
import { StyledLabel } from '@components/Input';
import { RouteComponentProps } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { borderColor, offWhite, white } from '@styles/color';
import { baseSpacer, halfSpacer } from '@styles/size';
import getSeason from '@utils/getSeason';
import sendTripInvitationEmail from '@utils/sendTripInvitationEmail';
import trackEvent from '@utils/trackEvent';
import { requiredField } from '@utils/validations';
import axios from 'axios';
import { endOfDay, startOfDay } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import { navigate } from 'gatsby';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { FaCamera, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

import { getInitValues } from './FormModel/formInitialValues';
import newTripFormModel from './FormModel/newTripFormModel';
import validationSchema from './FormModel/validationSchema';

type MembersToInviteType = { uid: string; email: string; greetingName: string }[];

type NewTripSummaryProps = {} & RouteComponentProps;

const Slide = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const { formId, formField } = newTripFormModel;

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  // const users = useSelector((state: RootState) => state.firestore.data.users);
  // const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  // const activeLoggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [membersToInvite, setMembersToInvite] = useState<MembersToInviteType>([]);

  const addNewTrip = (values: TripFormType) => {
    setIsLoading(true);
    const tripMembers: Record<string, any> = {};
    tripMembers[`${auth.uid}`] = {
      uid: auth.uid,
      status: TripMemberStatus.Owner,
      invitedAt: new Date(),
      acceptedAt: new Date(),
    };

    membersToInvite.forEach((member) => {
      tripMembers[`${member.uid}`] = {
        uid: member.uid,
        status: TripMemberStatus.Pending,
        invitedAt: new Date(),
        invitedBy: auth.uid,
      };
    });

    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate as string)),
        endDate: endOfDay(new Date(values.endDate as string)),
        tags: [],
        created: new Date(),
        tripMembers,
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
        });
        membersToInvite.forEach((member) => {
          sendTripInvitationEmail({
            tripId: docRef.id,
            invitedBy: profile.username,
            email: member.email,
            greetingName: member.greetingName,
            dispatch,
          });
        });
        trackEvent('New Trip Submit Successful', { values: { ...values } });
        navigate(`/app/trips/${docRef.id}/add-trip-image`);
      })
      .catch((err) => {
        trackEvent('New Trip Submit Unsuccessful', { values: { ...values }, error: err });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };


  const initialValues: TripFormType = getInitValues(auth.uid)

  return (
    <PageContainer>
      <>
        <Seo title="New Trip" />
        <Formik
          validateOnMount
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const valuesWithSeason = {
              ...values,
              season: getSeason(values.lat, values.lng, values.startDate as string),
            };
            trackEvent('New Trip Submit Button Clicked', valuesWithSeason);

            addNewTrip(valuesWithSeason);

            setSubmitting(false);
          }}
        >
          {({
            isSubmitting,
            isValid,
            values,
            setFieldValue,
            dirty,
            errors,
            setFieldTouched,
            touched,
            ...rest
          }) => (
            <Form autoComplete="off">
              <SwipeableViews disabled index={activeTab}>
                {/* Location input */}

                {/* Dates input */}

                {/* People input */}

                {/* Trip name input */}
                <Slide>
                  <Row>
                    <Column xs={4} xsOffset={2} xsSpacer xsOrder={1}>
                      <Button
                        type="button"
                        color="text"
                        block
                        onClick={() => onSwitch(-1)}
                        iconLeft={<FaChevronLeft />}
                      >
                        Back
                      </Button>
                    </Column>
                    <Column xs={4} xsOrder={2}>
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
                </Slide>

                {/* Image input */}
                <Slide>
                  <Row>
                    <Column xs={4} xsOffset={2} xsSpacer xsOrder={1}>
                      <Button
                        type="button"
                        color="text"
                        block
                        onClick={() => onSwitch(-1)}
                        iconLeft={<FaChevronLeft />}
                      >
                        Back
                      </Button>
                    </Column>
                    <Column xs={4} xsOrder={2}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid || isLoading}
                        isLoading={isLoading}
                        color="success"
                        iconRight={<FaChevronRight />}
                      >
                        Submit
                      </Button>
                    </Column>
                  </Row>
                </Slide>
              </SwipeableViews>

              {/* <FormErrors dirty={dirty} errors={errors} /> */}
              {/* <FlexContainer justifyContent="space-between"> */}
              {/*  <Button */}
              {/*    type="link" */}
              {/*    to="../" */}
              {/*    color="tertiary" */}
              {/*    rightSpacer */}
              {/*    iconLeft={<FaChevronLeft />} */}
              {/*    onClick={() => */}
              {/*      trackEvent('New Trip Forms Cancelled', { */}
              {/*        values: { ...values }, */}
              {/*        errors: { ...errors }, */}
              {/*        touched: { ...touched }, */}
              {/*        dirty, */}
              {/*        isValid, */}
              {/*      }) */}
              {/*    } */}
              {/*  > */}
              {/*    Cancel */}
              {/*  </Button> */}
              {/*  <Button */}
              {/*    type="submit" */}
              {/*    disabled={isSubmitting || !isValid || isLoading} */}
              {/*    isLoading={isLoading} */}
              {/*    color="success" */}
              {/*    iconRight={<FaChevronRight />} */}
              {/*  > */}
              {/*    Continue */}
              {/*  </Button> */}
              {/* </FlexContainer> */}
            </Form>
          )}
        </Formik>
      </>
    </PageContainer>
  );
};

export default NewTripSummary;
