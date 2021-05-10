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
                  <div key={item.name}>
                    <Field
                      as={IconCheckbox}
                      icon={item.icon}
                      checked={values[item.name] ?? false}
                      name={item.name}
                      label={item.label}
                    />
                  </div>
                ))}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox title="Accommodations">
              <HorizontalScroller>
                {gearListAccommodations.map((item) => (
                  <div key={item.name}>
                    <Field
                      as={IconCheckbox}
                      icon={item.icon}
                      checked={values[item.name] ?? false}
                      name={item.name}
                      label={item.label}
                    />
                  </div>
                ))}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox title="Camp Kitchen">
              <HorizontalScroller>
                {gearListCampKitchen.map((item) => (
                  <div key={item.name}>
                    <Field
                      as={IconCheckbox}
                      icon={item.icon}
                      checked={values[item.name] ?? false}
                      name={item.name}
                      label={item.label}
                    />
                  </div>
                ))}
              </HorizontalScroller>
            </CollapsibleBox>
            <CollapsibleBox title="Other Considerations">
              <HorizontalScroller>
                {gearListOtherConsiderations.map((item) => (
                  <div key={item.name}>
                    <Field
                      as={IconCheckbox}
                      icon={item.icon}
                      checked={values[item.name] ?? false}
                      name={item.name}
                      label={item.label}
                    />
                  </div>
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
