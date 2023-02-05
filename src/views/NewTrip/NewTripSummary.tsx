import { TripFormType, TripMemberStatus } from '@common/trip';
import { Button, Column, PageContainer, Row, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import getSeason from '@utils/getSeason';
import sendTripInvitationEmail from '@utils/sendTripInvitationEmail';
import trackEvent from '@utils/trackEvent';
import { endOfDay, startOfDay } from 'date-fns';
import { Form, Formik } from 'formik';
import { navigate } from 'gatsby';
import React, { FunctionComponent, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

import getInitValues from './FormModel/formInitialValues';
import newTripFormModel from './FormModel/newTripFormModel';
import validationSchema from './FormModel/validationSchema';
import DateForm from './Forms/DateForm';
import ImageForm from './Forms/ImageForm';
import LocationForm from './Forms/LocationForm';
import MembersForm from './Forms/MembersForm';
import NameForm from './Forms/NameForm';

type MembersToInviteType = { uid: string; email: string; greetingName: string }[];
type NewTripSummaryProps = {} & RouteComponentProps;

const { formId, formField } = newTripFormModel;
const steps = ['Location', 'Date', 'Members', 'Name', 'Image'];

/**
 * TODO: add type to parameters or refactor forms to eliminate the need for this
 * @param step
 * @param parameters
 */
const renderStepContent = (step: number, parameters: any) => {
  switch (step) {
    case 0:
      return (
        <LocationForm
          formField={formField}
          setFieldTouched={parameters.setFieldTouched}
          setFieldValue={parameters.setFieldValue}
        />
      );
    case 1:
      return (
        <DateForm
          formField={formField}
          formValues={parameters.formValues}
          setFieldValue={parameters.setFieldValue}
          setFieldTouched={parameters.setFieldTouched}
        />
      );
    case 2:
      return (
        <MembersForm
          activeLoggedInUser={parameters.activeLoggedInUser}
          membersToInvite={parameters.membersToInvite}
          auth={parameters.auth}
          setMembersToInvite={parameters.setMembersToInvite}
        />
      );
    case 3:
      return <NameForm formField={formField} />;
    case 4:
      return <ImageForm formField={formField} setFieldValue={parameters.setFieldValue} />;
    default:
      return <div>Form Not Found</div>;
  }
};

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const isLastStep = activeStep === steps.length - 1;
  const [membersToInvite, setMembersToInvite] = useState<MembersToInviteType>([]);

  const submitForm = (values: TripFormType) => {
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

  const handleSubmit = (values: TripFormType, actions: any) => {
    if (isLastStep) {
      const valuesWithSeason = {
        ...values,
        season: getSeason(values.lat, values.lng, values.startDate as string),
      };
      trackEvent('New Trip Submit Button Clicked', valuesWithSeason);

      submitForm(valuesWithSeason);

      actions.setSubmitting(false);
    } else {
      setActiveStep(activeStep + 1);
      actions.setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const initialValues: TripFormType = getInitValues(auth.uid);
  const currentValidationSchema = validationSchema[activeStep];

  return (
    <PageContainer>
      <Seo title="New Trip" />
      {activeStep === steps.length ? (
        <div>New trip created, redirect to trips list</div>
      ) : (
        <Formik
          validationSchema={currentValidationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, values, setFieldValue, setFieldTouched }) => (
            <Form autoComplete="off" id={formId}>
              {renderStepContent(activeStep, {
                formValues: values,
                setFieldValue,
                setFieldTouched,
                activeLoggedInUser,
                membersToInvite,
                setMembersToInvite,
                auth,
              })}

              <Row>
                <Column xs={4} xsOffset={2} xsSpacer xsOrder={1}>
                  {activeStep !== 0 && (
                    <Button
                      type="button"
                      color="text"
                      block
                      disabled={isSubmitting || !isValid || isLoading}
                      onClick={handleBack}
                      iconLeft={<FaChevronLeft />}
                    >
                      Back
                    </Button>
                  )}
                </Column>
                <Column xs={4} xsOrder={2}>
                  {isLastStep ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid || isLoading}
                      isLoading={isLoading}
                      color="success"
                      iconRight={<FaChevronRight />}
                    >
                      Create
                    </Button>
                  ) : (
                    <Button
                      disabled={isSubmitting || !isValid || isLoading}
                      type="submit"
                      block
                      iconRight={<FaChevronRight />}
                    >
                      Next
                    </Button>
                  )}
                </Column>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </PageContainer>
  );
};

export default NewTripSummary;
