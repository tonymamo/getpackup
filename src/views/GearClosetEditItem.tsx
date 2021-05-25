import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { FaCheckCircle, FaChevronLeft } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';

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
  const personalGear = usePersonalGear();
  const [isLoading, setIsLoading] = useState(false);

  const activeItem: GearItemType =
    personalGear && personalGear.find((item: GearItemType) => item.id === props.id);

  const initialValues: GearItemType = activeItem;

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
          <Formik
            validateOnMount
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
              // updateGearItem(values);

              setSubmitting(false);
              setIsLoading(false);
            }}
          >
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
