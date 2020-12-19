import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

import { Input, Button, HorizontalRule, Column, Row } from '@components';
import { StyledLabel } from '@components/Input';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import ReactDatepickerTheme from '@styles/react-datepicker';

type TripSummaryProps = {
  initialValues: {
    name: string;
    description: string;
    startingPoint: string;
    startDate: string | Date;
    endDate: string | Date;
    owner: string;
    tripId?: string;
  };
  type: 'new' | 'edit';
};

const TripSummaryForm: FunctionComponent<TripSummaryProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const addNewTrip = (values: TripSummaryProps['initialValues']) => {
    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        timezoneOffset: new Date().getTimezoneOffset(),
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
          created: new Date(),
        });
        navigate(`/app/trips/${docRef.id}/generator`);
        dispatch(
          addAlert({
            type: 'success',
            message: 'Successfully created new trip',
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
  };

  const updateTrip = (values: TripSummaryProps['initialValues']) => {
    firebase
      .firestore()
      .collection('trips')
      .doc(props.initialValues.tripId)
      .set({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        updated: new Date(),
      })
      .then(() => {
        navigate('/app/trips');
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully updated ${values.name}`,
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
  };

  const [dateRangeStart, setDateRangeStart] = useState(new Date(props.initialValues.startDate));
  const [dateRangeEnd, setDateRangeEnd] = useState(new Date(props.initialValues.endDate));

  return (
    <>
      <ReactDatepickerTheme />
      <Formik
        validateOnMount
        initialValues={props.initialValues}
        onSubmit={(values, { setSubmitting }) => {
          if (props.type === 'new') {
            addNewTrip(values);
          }
          if (props.type === 'edit') {
            updateTrip(values);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, values, setFieldValue, ...rest }) => (
          <Form>
            <Field
              as={Input}
              type="text"
              name="name"
              label="Trip Name"
              validate={requiredField}
              required
            />

            <Field
              as={Input}
              type="textarea"
              name="description"
              label="Description"
              validate={requiredField}
              required
            />
            {typeof window !== 'undefined' && window.google && (
              <Field
                as={Input}
                type="geosuggest"
                name="startingPoint"
                label="Starting Location"
                validate={requiredField}
                required
                setFieldValue={setFieldValue}
                {...rest}
              />
            )}

            <Row>
              <Column sm={6}>
                <StyledLabel required>Start Date</StyledLabel>
                <DatePicker
                  selected={dateRangeStart}
                  onChange={(date: Date) => {
                    setFieldValue('startDate', date);
                    setDateRangeStart(date);
                  }}
                  minDate={new Date()}
                />
              </Column>
              <Column sm={6}>
                <StyledLabel required>End Date</StyledLabel>
                <DatePicker
                  selected={dateRangeEnd}
                  onChange={(date: Date) => {
                    setFieldValue('endDate', date);
                    setDateRangeEnd(date);
                  }}
                  minDate={new Date(values.startDate)}
                />
              </Column>
            </Row>

            <HorizontalRule />
            <p>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                iconLeft={props.type === 'new' ? <FaChevronCircleRight /> : <FaCheckCircle />}
              >
                {props.type === 'new' ? 'Select Activites' : 'Update Trip'}
              </Button>
            </p>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TripSummaryForm;
