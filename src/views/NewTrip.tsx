import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaPlusCircle } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';

import {
  Row,
  Column,
  Input,
  Heading,
  PageContainer,
  Box,
  Button,
  Seo,
  HorizontalRule,
} from '../components';
import { RootState } from '../redux/ducks';
import { addAlert } from '../redux/ducks/globalAlerts';
import { requiredField } from '../utils/validations';

type NewTripProps = {} & RouteComponentProps;

const NewTrip: FunctionComponent<NewTripProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const initialValues = {
    name: '',
    description: '',
    startingPoint: '',
    startDate: '',
    endDate: '',
    owner: auth.uid,
  };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="New Trip" />
      <Box>
        <Heading>Create New Trip</Heading>
        <Formik
          validateOnMount
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            firebase
              .firestore()
              .collection('trips')
              .add(values)
              .then((docRef) => {
                docRef.update({
                  tripId: docRef.id,
                });
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
                  iconLeft={<FaPlusCircle />}
                >
                  Create Trip
                </Button>
              </p>
            </Form>
          )}
        </Formik>
      </Box>
    </PageContainer>
  );
};

export default NewTrip;
