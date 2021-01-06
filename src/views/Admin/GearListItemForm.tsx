import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';

import { Input, Button, HorizontalRule, Row, Column, Heading } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField, requiredSelect } from '@utils/validations';
import { RootState } from '@redux/ducks';
import { GearItem } from '@views/Admin/GearList';
import {
  gearListTripType,
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListTransportation,
} from '@utils/gearListItemEnum';

type GearListItemFormProps = {
  initialValues: GearItem;
  type: 'new' | 'edit';
};

const GearListItemForm: FunctionComponent<GearListItemFormProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
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
        lastEditedBy: auth.uid,
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
          created: new Date(),
        });
        navigate('/admin/gear-list');
        dispatch(
          addAlert({
            type: 'success',
            message: 'Successfully created new gear list item',
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

  const updateGearItem = (values: GearListItemFormProps['initialValues']) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('gear')
      .doc(props.initialValues.id)
      .set({
        ...values,
        lastEditedBy: auth.uid,
        updated: new Date(),
      })
      .then(() => {
        navigate('/admin/gear-list');
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
        {({ isSubmitting, isValid, dirty, setFieldValue, ...rest }) => (
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
                  options={[
                    { value: 'Activity Gear', label: 'Activity Gear' },
                    { value: 'Safety & Tools', label: 'Safety & Tools' },
                    { value: 'Clothing & Footwear', label: 'Clothing & Footwear' },
                    { value: 'Food & Water', label: 'Food & Water' },
                    { value: 'Personal', label: 'Personal' },
                    { value: 'Accomodation', label: 'Accomodation' },
                    { value: 'Camp Kitchen', label: 'Camp Kitchen' },
                    { value: 'Transportation', label: 'Transportation' },
                  ]}
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

            <Heading as="h2">Transporation</Heading>
            <Row>
              {gearListTransportation.map((item) => (
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
                disabled={isSubmitting || !isValid || isLoading || !dirty}
                isLoading={isLoading}
                iconLeft={props.type === 'new' ? <FaChevronCircleRight /> : <FaCheckCircle />}
              >
                {props.type === 'new' ? 'Save Item' : 'Update Item'}
              </Button>
              <Button type="link" to="/admin/gear-list" color="dangerOutline">
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