import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';

import { Input, Button, HorizontalRule, Row, Column, Heading } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField, requiredSelect } from '@utils/validations';
import { GearItemType } from '@common/gearItem';
import {
  gearListTripType,
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListOtherConsiderations,
  gearListCategories,
} from '@utils/gearListItemEnum';

type GearListItemFormProps = {
  initialValues: GearItemType;
  type: 'new' | 'edit';
};

const GearListItemForm: FunctionComponent<GearListItemFormProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const addNewGearItem = (values: GearListItemFormProps['initialValues']) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('gear')
      .add({
        ...values,
        created: new Date(),
      })
      .then((docRef) => {
        setIsLoading(false);
        docRef.update({
          id: docRef.id,
        });
        navigate('/admin/gear-list');
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

  const updateGearItem = (values: GearListItemFormProps['initialValues']) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('gear')
      .doc(props.initialValues.id)
      .update({
        ...values,
        updated: new Date(),
      })
      .then(() => {
        setIsLoading(false);
        navigate('/admin/gear-list');
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
    <>
      <Formik
        validateOnMount
        initialValues={props.initialValues}
        onSubmit={(values, { setSubmitting }) => {
          if (props.type === 'new') {
            addNewGearItem(values);
          }
          if (props.type === 'edit') {
            updateGearItem(values);
          }
          setSubmitting(false);
          setIsLoading(false);
        }}
      >
        {({ isSubmitting, isValid, setFieldValue, ...rest }) => (
          <Form>
            <Row>
              <Column sm={6}>
                <Field
                  as={Input}
                  type="text"
                  name="name"
                  label="Item Name"
                  validate={requiredField}
                  required
                />
              </Column>
              <Column sm={6}>
                <Field
                  as={Input}
                  type="select"
                  name="category"
                  label="Category"
                  options={gearListCategories}
                  validate={requiredSelect}
                  setFieldValue={setFieldValue}
                  {...rest}
                  required
                />
              </Column>
            </Row>
            <Heading as="h2">Trip Type</Heading>
            <Row>
              {gearListTripType.map((item) => (
                <Column xs={6} sm={4} md={3} key={item.name}>
                  <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                </Column>
              ))}
            </Row>

            <Heading as="h2">Activities</Heading>
            <Row>
              {gearListActivities.map((item) => (
                <Column xs={6} sm={4} md={3} key={item.name}>
                  <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                </Column>
              ))}
            </Row>

            <Heading as="h2">Accommodations</Heading>
            <Row>
              {gearListAccommodations.map((item) => (
                <Column xs={6} sm={4} md={3} key={item.name}>
                  <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                </Column>
              ))}
            </Row>

            <Heading as="h2">Camp Kitchen</Heading>
            <Row>
              {gearListCampKitchen.map((item) => (
                <Column xs={6} sm={4} md={3} key={item.name}>
                  <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                </Column>
              ))}
            </Row>

            <Heading as="h2">Other Considerations</Heading>
            <Row>
              {gearListOtherConsiderations.map((item) => (
                <Column xs={6} sm={4} md={3} key={item.name}>
                  <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                </Column>
              ))}
            </Row>
            <HorizontalRule />
            <p>
              <Button
                rightSpacer
                type="submit"
                disabled={isSubmitting || !isValid}
                isLoading={isLoading}
                iconLeft={props.type === 'new' ? <FaChevronCircleRight /> : <FaCheckCircle />}
              >
                {props.type === 'new' ? 'Save Item' : 'Update Item'}
              </Button>
              <Button type="button" onClick={() => navigate(-1)} color="text">
                Cancel
              </Button>
            </p>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GearListItemForm;
