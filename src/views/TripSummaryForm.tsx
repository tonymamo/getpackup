import React, { FunctionComponent, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import { startOfDay, endOfDay } from 'date-fns';

import {
  Input,
  Button,
  HorizontalRule,
  Seo,
  FormErrors,
  DayPickerInput,
  FlexContainer,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import { TripType } from '@common/trip';
import getSeason from '@utils/getSeason';
import trackEvent from '@utils/trackEvent';

type ValuesType = Omit<TripType, 'startDate' | 'endDate'> & {
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
};

type TripSummaryProps = {
  initialValues: ValuesType;
};

const TripSummaryForm: FunctionComponent<TripSummaryProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const addNewTrip = (values: ValuesType) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate as string)),
        endDate: endOfDay(new Date(values.endDate as string)),
        tags: [],
        created: new Date(),
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
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

  return (
    <>
      <Seo title="New Trip">
        {typeof google !== 'object' && (
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        )}
      </Seo>
      <Formik
        validateOnMount
        initialValues={{
          ...props.initialValues,
          tripMembers: [],
        }}
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
            <Field
              as={Input}
              type="text"
              name="name"
              label="Trip Name"
              validate={requiredField}
              required
              autoComplete="off"
              maxLength={50}
            />

            <DayPickerInput
              label="Trip Date"
              initialValues={props.initialValues}
              values={values}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />

            <Field as={Input} type="textarea" name="description" label="Description" />

            <Field
              as={Input}
              type="geosuggest"
              types={[]}
              name="startingPoint"
              label="Trip Location"
              validate={requiredField}
              required
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              {...rest}
            />

            <HorizontalRule />

            <FormErrors dirty={dirty} errors={errors} />
            <FlexContainer justifyContent="space-between">
              <Button
                type="link"
                to="../"
                color="text"
                rightSpacer
                iconLeft={<FaChevronLeft />}
                onClick={() =>
                  trackEvent('New Trip Form Cancelled', {
                    values: { ...values },
                    errors: { ...errors },
                    touched: { ...touched },
                    dirty,
                    isValid,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || isLoading}
                isLoading={isLoading}
                color="success"
                iconRight={<FaChevronRight />}
              >
                Continue
              </Button>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TripSummaryForm;
