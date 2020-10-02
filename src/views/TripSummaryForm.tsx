import React, { FunctionComponent } from 'react';
import { FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';

import { Row, Column, Input, Button, HorizontalRule } from '../components';
import { addAlert } from '../redux/ducks/globalAlerts';
import { requiredField } from '../utils/validations';

type TripSummaryProps = {
  initialValues: {
    name: string;
    description: string;
    startingPoint: string;
    startDate: string;
    endDate: string;
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
        navigate('/app/trips');
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
            message: 'Successfully updated trip',
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

  return (
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
      {({ isSubmitting, isValid, ...rest }) => (
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
              {...rest}
            />
          )}

          <Row>
            <Column xs={6}>
              <Field
                as={Input}
                type="date"
                name="startDate"
                label="Start Date"
                validate={requiredField}
                required
              />
            </Column>
            <Column xs={6}>
              <Field
                as={Input}
                type="date"
                name="endDate"
                label="End Date"
                validate={requiredField}
                required
              />
            </Column>
          </Row>

          <HorizontalRule />
          <p>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              iconLeft={props.type === 'new' ? <FaPlusCircle /> : <FaCheckCircle />}
            >
              {props.type === 'new' ? 'Create' : 'Update'} Trip
            </Button>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default TripSummaryForm;
