import { Column, Heading, Input, Row } from '@components';
import { Field } from 'formik';
import React from 'react';

export default function LocationForm(props: any) {
  const {
    formField: { startingPoint },
    setFieldTouched,
    setFieldValue,
  } = props;

  return (
    <>
      <Row>
        <Column xs={8} xsOffset={2}>
          <Heading>Where are you headed?</Heading>
        </Column>
      </Row>
      <Row>
        <Column xs={8} xsOffset={2}>
          <Field
            as={Input}
            type="geosuggest"
            types={[]}
            name={startingPoint.name}
            label={startingPoint.label}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            required
          />
        </Column>
      </Row>
    </>
  );
}
