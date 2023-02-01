import { Column, Heading, Input, Row } from '@components';
import { Field } from 'formik';
import React from 'react';

export default function NameForm(props: any) {
  const {
    formField: { name },
  } = props;

  return (
    <>
      <Row>
        <Column xs={8} xsOffset={2}>
          <Heading>Trip Name</Heading>
        </Column>
      </Row>
      <Row>
        <Column xs={8} xsOffset={2}>
          <Field
            as={Input}
            type="text"
            name={name.name}
            label={name.label}
            required
            autoComplete="off"
            maxLength={50}
          />
        </Column>
      </Row>
    </>
  );
}
