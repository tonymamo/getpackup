import { Field, Form, Formik } from 'formik';
import React from 'react';

import {
  gearListActivities,
  gearListAccommodations,
  gearListOtherConsiderations,
  gearListKeys,
  gearListCampKitchen,
} from '@utils/gearListItemEnum';
import {
  CollapsibleBox,
  Heading,
  HorizontalScroller,
  IconCheckbox,
  PageContainer,
  Seo,
} from '@components';

const initialValues: { [key: string]: boolean } = {};

gearListKeys.forEach((item) => {
  initialValues[item] = false;
});

const GearClosetSetup = () => {
  const onSubmit = () => {};

  return (
    <PageContainer>
      <Seo title="Gear Closet" />
      <Heading altStyle as="h2" noMargin align="center">
        Setup your gear closet
      </Heading>
      <p style={{ textAlign: 'center' }}>
        <small>Select all the categories relevant to you so we can populate your closet.</small>
      </p>
      <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, isValid, values }) => (
          <Form>
            <CollapsibleBox title="Activities">
              <HorizontalScroller>
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
              <HorizontalScroller>
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
              <HorizontalScroller>
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
              <HorizontalScroller>
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
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default GearClosetSetup;
