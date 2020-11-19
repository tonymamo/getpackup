import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';

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
import { RootState } from '../redux/ducks';

type TripGeneratorProps = {} & RouteComponentProps;

const TripGenerator: FunctionComponent<TripGeneratorProps> = () => {
  // const auth = useSelector((state: RootState) => state.firebase.auth);

  // const initialValues = {
  //   name: '',
  //   description: '',
  //   startingPoint: '',
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   owner: auth.uid,
  // };

  return (
    <>
      <Seo title="Trip Generator" />
      <Box>
        <Formik
          validateOnMount
          initialValues={{
            hotel: '',
            hostel: '',
            carCamp: '',
            servicedHut: '',
            basicHut: '',
            tent: '',
            airplane: '',
            car: '',
            bus: '',
            boat: '',
            train: '',
            motorcycle: '',
            hike: '',
            bike: '',
            climb: '',
            ski: '',
            snowboard: '',
            paddle: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            // if (props.type === 'new') {
            //   addNewTrip(values);
            // }
            // if (props.type === 'edit') {
            //   updateTrip(values);
            // }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid, values }) => (
            <Form>
              <Heading altStyle as="h2" noMargin>
                Accommodations
              </Heading>
              <p>Select all that apply</p>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHotel"
                    checked={values.hotel ?? false}
                    name="hotel"
                    label="Hotel"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBed"
                    checked={values.hostel ?? false}
                    name="hostel"
                    label="Hostel"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCaravan"
                    checked={values.carCamp ?? false}
                    name="carCamp"
                    label="Camper/Car"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaWarehouse"
                    checked={values.servicedHut ?? false}
                    name="servicedHut"
                    label="Serviced Hut"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHome"
                    checked={values.basicHut ?? false}
                    name="basicHut"
                    label="Basic Hut"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCampground"
                    checked={values.tent ?? false}
                    name="tent"
                    label="Tent"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <Heading altStyle as="h2" noMargin>
                Transportation
              </Heading>
              <p>Select all that apply</p>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaPlane"
                    checked={values.airplane ?? false}
                    name="airplane"
                    label="Airplane"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaCar"
                    checked={values.car ?? false}
                    name="car"
                    label="Car"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBusAlt"
                    checked={values.bus ?? false}
                    name="bus"
                    label="Bus"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaShip"
                    checked={values.boat ?? false}
                    name="boat"
                    label="Boat"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaTrain"
                    checked={values.train ?? false}
                    name="train"
                    label="Train"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaMotorcycle"
                    checked={values.motorcycle ?? false}
                    name="motorcycle"
                    label="Motorcycle"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <Heading altStyle as="h2" noMargin>
                Activities
              </Heading>
              <p>Select all that apply</p>
              <Row>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaHiking"
                    checked={values.hike ?? false}
                    name="hike"
                    label="Hike"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaBicycle"
                    checked={values.bike ?? false}
                    name="bike"
                    label="Ride"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaMountain"
                    checked={values.climb ?? false}
                    name="climb"
                    label="Climb"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaWater"
                    checked={values.paddle ?? false}
                    name="paddle"
                    label="Paddle"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaSkiing"
                    checked={values.ski ?? false}
                    name="ski"
                    label="Ski"
                  />
                </Column>
                <Column xs={4} md={2}>
                  <Field
                    as={IconCheckbox}
                    icon="fa/FaSnowboarding"
                    checked={values.snowboard ?? false}
                    name="snowboard"
                    label="Snowboard"
                  />
                </Column>
              </Row>
              <HorizontalRule />
              <p>
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  Submit
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
