import React, { FunctionComponent, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FaCheckCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import pickBy from 'lodash/pickBy';

import {
  gearListActivities,
  gearListAccommodations,
  gearListOtherConsiderations,
  gearListKeys,
  gearListCampKitchen,
} from '@utils/gearListItemEnum';
import {
  Button,
  CollapsibleBox,
  Column,
  Heading,
  HorizontalScroller,
  IconCheckbox,
  Modal,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import { addAlert } from '@redux/ducks/globalAlerts';

type GearClosetSetupProps = unknown;
const GearClosetSetup: FunctionComponent<GearClosetSetupProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const [isLoading, setIsLoading] = useState(false);

  const initialValues: { [key: string]: boolean } = {};

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  const onSubmit = (
    values: typeof initialValues,
    { resetForm, setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setIsLoading(true);

    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .set({
        categories: Object.keys(pickBy(values, (val) => val === true)),
        owner: auth.uid,
        id: auth.uid,
        removals: [],
      })
      .then(() => {
        resetForm();
        trackEvent('Gear Closet Generation Successfully Completed', { values });
        dispatch(
          addAlert({
            type: 'success',
            message: 'Successfully generated your gear closet!',
          })
        );
      })
      .catch((error: Error) => {
        trackEvent('Gear Closet Generation Failed', { values, error });
        dispatch(
          addAlert({
            type: 'danger',
            message: 'Failed to create your closet, please try again.',
          })
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <PageContainer>
      <Seo title="Gear Closet" />
      <Heading altStyle as="h1" noMargin align="center">
        Let&apos;s build out your gear closet
      </Heading>
      <p style={{ textAlign: 'center' }}>
        <small>
          Select all the categories relevant to you so we can populate your closet. Once you build
          out your gear closet with all of your gear, we will use it to populate your packing lists
          dynamically based on what activities you do on each trip!
        </small>
      </p>
      <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, isValid, values }) => (
          <Form>
            <CollapsibleBox
              title="Activities"
              subtitle="What activities do you own gear for, or are interested in doing?"
            >
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
            <CollapsibleBox
              title="Accommodations"
              subtitle="What types of places do you stay in on your trips?"
            >
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
            <CollapsibleBox
              title="Camp Kitchen"
              subtitle="What type of kitchen setup(s) do you see yourself using on your trips?"
            >
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
            <CollapsibleBox
              title="Other Considerations"
              subtitle="What other things might you need to bring on trips?"
            >
              <HorizontalScroller withBorder>
                {/* remove '10 essentials' category, the last item in the array */}
                {[...gearListOtherConsiderations.slice(0, -1)].map((item) => (
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
            <Row>
              <Column md={4} mdOffset={8}>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isLoading}
                  block
                  color="success"
                  iconLeft={<FaCheckCircle />}
                >
                  {isLoading ? 'Saving' : 'Save'}
                </Button>
              </Column>
            </Row>
          </Form>
        )}
      </Formik>

      <Modal toggleModal={() => {}} isOpen={isLoading}>
        <Heading>Populating your gear closet...</Heading>
        {/* TODO: loading animation? */}
        <p>Please hold tight while we build out your virtual closet of gear!</p>
      </Modal>
    </PageContainer>
  );
};

export default GearClosetSetup;
