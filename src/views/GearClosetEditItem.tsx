import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import omit from 'lodash/omit';

import {
  Seo,
  Heading,
  LoadingPage,
  PageContainer,
  Button,
  Input,
  Column,
  Row,
  HorizontalScroller,
  IconCheckbox,
  CollapsibleBox,
  Alert,
} from '@components';
import { GearItemType } from '@common/gearItem';
import { halfSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import usePersonalGear from '@hooks/usePersonalGear';
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

type GearClosetEditItemProps = {
  id?: string;
} & RouteComponentProps;

const StyledBackLink = styled(Link)`
  display: inline-block;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: ${halfSpacer};
  font-size: ${fontSizeSmall};
`;

const GearClosetEditItem: FunctionComponent<GearClosetEditItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const personalGear = usePersonalGear();
  const [isLoading, setIsLoading] = useState(false);

  const activeItem: GearItemType =
    personalGear && personalGear.find((item: GearItemType) => item.id === props.id);

  const initialValues: GearItemType = activeItem;

  const save = (values: typeof initialValues) => {
    // update a custom gear item that already exists
    if (values.isCustomGearItem) {
      return firebase
        .firestore()
        .collection('gear-closet')
        .doc(auth.uid)
        .collection('additions')
        .doc(props.id)
        .set({
          ...values,
          isCustomItem: true,
          updated: new Date(),
        });
    }
    // add the id of the original master gear list item to the removals array
    // then create a new custom gear item
    return firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        removals: firebase.firestore.FieldValue.arrayUnion(values.id),
      })
      .then(() => {
        firebase
          .firestore()
          .collection('gear-closet')
          .doc(auth.uid)
          .collection('additions')
          .add({
            ...omit(values, 'id'),
            isCustomGearItem: true,
            created: new Date(),
          })
          .then((docRef) => {
            docRef.update({
              id: docRef.id,
            });
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
        trackEvent('Gear Closet Edit Item Submitted', { values });
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully updated ${values.name}`,
          })
        );
      })
      .catch((error: Error) => {
        trackEvent('Gear Closet Edit Item Submit Failure', { values, error });
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

  return (
    <PageContainer>
      <Seo title="Edit Gear Closet Item" />
      <StyledBackLink
        to="../"
        onClick={() =>
          trackEvent('Edit Gear Closet Item Back to All Gear Click', { ...activeItem })
        }
      >
        <FaChevronLeft /> Back to All Gear
      </StyledBackLink>
      {activeItem && (
        <>
          <Heading>Edit Gear Item</Heading>
          {activeItem.essential && (
            <Alert
              type="info"
              message="This item is considered one of the 10 Essential items."
              callToActionLink="/blog/2021-03-29-the-ten-essentials/"
              callToActionLinkText="Learn more"
            />
          )}
          <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, isSubmitting, isValid, setFieldValue, ...rest }) => (
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
                <CollapsibleBox title="Activities">
                  <HorizontalScroller withBorder>
                    {gearListActivities.map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))}
                  </HorizontalScroller>
                </CollapsibleBox>
                <CollapsibleBox title="Accommodations">
                  <HorizontalScroller withBorder>
                    {gearListAccommodations.map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))}
                  </HorizontalScroller>
                </CollapsibleBox>
                <CollapsibleBox title="Camp Kitchen">
                  <HorizontalScroller withBorder>
                    {gearListCampKitchen.map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))}
                  </HorizontalScroller>
                </CollapsibleBox>
                <CollapsibleBox title="Other Considerations">
                  <HorizontalScroller withBorder>
                    {gearListOtherConsiderations.map((item) => (
                      <li key={item.name}>
                        <Field
                          as={IconCheckbox}
                          icon={item.icon}
                          checked={values[item.name] ?? false}
                          name={item.name}
                          label={item.label}
                        />
                      </li>
                    ))}
                  </HorizontalScroller>
                </CollapsibleBox>
                <p>
                  <Button
                    rightSpacer
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    isLoading={isLoading}
                    iconLeft={<FaCheckCircle />}
                  >
                    Update Item
                  </Button>
                  <Button type="link" to="../" color="dangerOutline">
                    Cancel
                  </Button>
                </p>
              </Form>
            )}
          </Formik>
        </>
      )}
      {(!activeItem || !isLoaded) && <LoadingPage />}
    </PageContainer>
  );
};

export default GearClosetEditItem;
