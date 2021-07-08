import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import { FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { Formik, Form, Field, FormikHelpers } from 'formik';

import {
  Seo,
  Heading,
  PageContainer,
  Button,
  Input,
  Column,
  Row,
  CollapsibleBox,
  FormErrors,
} from '@components';
import { ActivityTypes, activityTypesList, GearItemType, GearListEnumType } from '@common/gearItem';
import trackEvent from '@utils/trackEvent';
import { requiredField, requiredSelect } from '@utils/validations';
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListCategories,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { StyledLabel } from '@components/Input';
import useWindowSize from '@utils/useWindowSize';

type GearClosetAddItemProps = {} & RouteComponentProps;

const GearClosetAddItem: FunctionComponent<GearClosetAddItemProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const [isLoading, setIsLoading] = useState(false);

  const size = useWindowSize();

  const initialValues: GearItemType = {
    id: '',
    name: '',
    category: '',
    isCustomGearItem: true,
    weight: '',
    weightUnit: 'g',
    notes: '',
    quantity: 1,
    essential: false,
  };

  activityTypesList.forEach((item) => {
    initialValues[item] = false;
  });

  const save = (values: typeof initialValues) => {
    return firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .collection('additions')
      .add({
        ...values,
        isCustomGearItem: true,
        created: new Date(),
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
        });
      });
  };

  const onSubmit = (
    values: typeof initialValues,
    { resetForm, setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setIsLoading(true);

    save(values)
      .then(() => {
        resetForm();
        trackEvent('Gear Closet Add Item Submitted', { values });
      })
      .catch((error: Error) => {
        trackEvent('Gear Closet Add Item Submit Failure', { values, error });
        dispatch(
          addAlert({
            type: 'danger',
            message: `Failed to update ${values.name}, please try again.`,
          })
        );
      })
      .finally(() => {
        setSubmitting(false);
        navigate('../');
      });
  };

  const getSelectedCount = (arr: GearListEnumType, values: typeof initialValues) => {
    const count = arr.filter((item) => values[item.name] === true).length;
    return `${count} ${count === 1 ? 'category' : 'categories'} selected`;
  };

  return (
    <PageContainer>
      <Seo title="Add Gear Closet Item" />
      {!size.isSmallScreen && (
        <Button
          type="button"
          onClick={() => {
            navigate(-1);
            trackEvent('Add Gear Closet Item Back to All Gear Click');
          }}
          color="text"
          iconLeft={<FaChevronLeft />}
        >
          Back to All Gear
        </Button>
      )}

      <>
        <Heading>Add Gear Item</Heading>

        <Formik
          validateOnMount
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={(values) => {
            const activityTypeCheckedValuesLength = Object.keys(values)
              .filter((valueKey) => activityTypesList.includes(valueKey as keyof ActivityTypes))
              .filter((item) => values[item] === true).length;
            return activityTypeCheckedValuesLength === 0
              ? { selectOne: 'You must tag an item with at least one sub-category option' }
              : {};
          }}
        >
          {({ values, isSubmitting, isValid, setFieldValue, dirty, errors, ...rest }) => (
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
                <Column sm={6}>
                  <Field
                    as={Input}
                    type="number"
                    name="quantity"
                    label="Quantity"
                    setFieldValue={setFieldValue}
                  />
                </Column>
                <Column sm={6}>
                  <Row>
                    <Column xs={8}>
                      <Field as={Input} type="text" name="weight" label="Weight" />
                    </Column>
                    <Column xs={4}>
                      <Field
                        as={Input}
                        type="select"
                        name="weightUnit"
                        label="Unit"
                        options={[
                          { value: 'g', label: 'g' },
                          { value: 'kg', label: 'kg' },
                          { value: 'oz', label: 'oz' },
                          { value: 'lb', label: 'lb' },
                        ]}
                        setFieldValue={setFieldValue}
                        {...rest}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Field as={Input} type="textarea" name="notes" label="Notes/Description" />
              <StyledLabel required>Tag your Item</StyledLabel>
              <p>
                Select all sub-categories that apply to your item, so that this item will get
                included whenever you create a trip that has any of the matching sub-categories.
              </p>
              <CollapsibleBox
                title="Activities"
                subtitle={getSelectedCount(gearListActivities, values)}
              >
                <Row>
                  {gearListActivities.map((item) => (
                    <Column xs={6} md={4} lg={3} key={item.name}>
                      <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                    </Column>
                  ))}
                </Row>
              </CollapsibleBox>
              <CollapsibleBox
                title="Accommodations"
                subtitle={getSelectedCount(gearListAccommodations, values)}
                defaultClosed
              >
                <Row>
                  {gearListAccommodations.map((item) => (
                    <Column xs={6} md={4} lg={3} key={item.name}>
                      <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                    </Column>
                  ))}
                </Row>
              </CollapsibleBox>
              <CollapsibleBox
                title="Camp Kitchen"
                subtitle={getSelectedCount(gearListCampKitchen, values)}
                defaultClosed
              >
                <Row>
                  {gearListCampKitchen.map((item) => (
                    <Column xs={6} md={4} lg={3} key={item.name}>
                      <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                    </Column>
                  ))}
                </Row>
              </CollapsibleBox>
              <CollapsibleBox
                title="Other Considerations"
                subtitle={getSelectedCount(gearListOtherConsiderations, values)}
                defaultClosed
              >
                <Row>
                  {gearListOtherConsiderations.map((item) => (
                    <Column xs={6} md={4} lg={3} key={item.name}>
                      <Field as={Input} type="checkbox" name={item.name} label={item.label} />
                    </Column>
                  ))}
                </Row>
              </CollapsibleBox>
              <FormErrors dirty={dirty} errors={errors as string[]} />
              <p>
                <Button
                  rightSpacer
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isLoading}
                  iconLeft={<FaCheckCircle />}
                >
                  Add Item
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    navigate(-1);
                    trackEvent('Add Gear Closet Item Cancel Click');
                  }}
                  color="text"
                >
                  Cancel
                </Button>
              </p>
            </Form>
          )}
        </Formik>
      </>
    </PageContainer>
  );
};

export default GearClosetAddItem;
