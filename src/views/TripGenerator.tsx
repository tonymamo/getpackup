import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Formik, Form, Field } from 'formik';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { navigate } from 'gatsby';

import {
  Heading,
  Box,
  Seo,
  Button,
  HorizontalRule,
  IconCheckbox,
  Row,
  Column,
} from '../components';
import { addAlert } from '../redux/ducks/globalAlerts';

type TripGeneratorProps = {
  id: string; // reach router param
} & RouteComponentProps;

const TripGenerator: FunctionComponent<TripGeneratorProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const initialValues = {
    accommodations: {
      hotel: '',
      hostel: '',
      carCamp: '',
      servicedHut: '',
      basicHut: '',
      tent: '',
    },
    transporation: {
      airplane: '',
      car: '',
      bus: '',
      boat: '',
      train: '',
      motorcycle: '',
    },
    activities: {
      hike: '',
      bike: '',
      climb: '',
      ski: '',
      snowboard: '',
      paddle: '',
    },
  };

  return (
    <>
      <Seo title="Trip Generator" />
      <Box>
        <Formik
          validateOnMount
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const getValues = (
              list:
                | typeof initialValues['accommodations']
                | typeof initialValues['transporation']
                | typeof initialValues['activities']
            ) =>
              Object.entries(list)
                .filter((entry) => entry[1])
                .map((key) => key[0]);

            firebase
              .firestore()
              .collection('trips')
              .doc(props.id)
              .set(
                {
                  tripGeneratorOptions: {
                    accommodations: getValues(values.accommodations),
                    activities: getValues(values.activities),
                    transporation: getValues(values.transporation),
                  },
                  updated: new Date(),
                },
                { merge: true }
              )
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
              <HorizontalRule />
              <Heading altStyle as="h2" noMargin>
                Activities
              </Heading>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHiking"
                    checked={values.activities.hike ?? false}
                    name="activities.hike"
                    label="Hike"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBicycle"
                    checked={values.activities.bike ?? false}
                    name="activities.bike"
                    label="Ride"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaMountain"
                    checked={values.activities.climb ?? false}
                    name="activities.climb"
                    label="Climb"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaWater"
                    checked={values.activities.paddle ?? false}
                    name="activities.paddle"
                    label="Paddle"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaSkiing"
                    checked={values.activities.ski ?? false}
                    name="activities.ski"
                    label="Ski"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaSnowboarding"
                    checked={values.activities.snowboard ?? false}
                    name="activities.snowboard"
                    label="Snowboard"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <Heading altStyle as="h2" noMargin>
                Accommodations
              </Heading>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHotel"
                    checked={values.accommodations.hotel ?? false}
                    name="accommodations.hotel"
                    label="Hotel"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBed"
                    checked={values.accommodations.hostel ?? false}
                    name="accommodations.hostel"
                    label="Hostel"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCaravan"
                    checked={values.accommodations.carCamp ?? false}
                    name="accommodations.carCamp"
                    label="Camper/Car"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaWarehouse"
                    checked={values.accommodations.servicedHut ?? false}
                    name="accommodations.servicedHut"
                    label="Serviced Hut"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHome"
                    checked={values.accommodations.basicHut ?? false}
                    name="accommodations.basicHut"
                    label="Basic Hut"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCampground"
                    checked={values.accommodations.tent ?? false}
                    name="accommodations.tent"
                    label="Tent"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <Heading altStyle as="h2" noMargin>
                Transportation
              </Heading>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaPlane"
                    checked={values.transporation.airplane ?? false}
                    name="transporation.airplane"
                    label="Airplane"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCar"
                    checked={values.transporation.car ?? false}
                    name="transporation.car"
                    label="Car"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBusAlt"
                    checked={values.transporation.bus ?? false}
                    name="transporation.bus"
                    label="Bus"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaShip"
                    checked={values.transporation.boat ?? false}
                    name="transporation.boat"
                    label="Boat"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaTrain"
                    checked={values.transporation.train ?? false}
                    name="transporation.train"
                    label="Train"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaMotorcycle"
                    checked={values.transporation.motorcycle ?? false}
                    name="transporation.motorcycle"
                    label="Motorcycle"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <p>
                <Button type="submit" disabled={isSubmitting || !isValid} rightSpacer>
                  Submit
                </Button>
                <Button type="link" to={`/app/trips/${props.id}`} color="primaryOutline">
                  Skip
                </Button>
              </p>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default TripGenerator;
