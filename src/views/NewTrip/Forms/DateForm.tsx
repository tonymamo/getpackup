import { Column, DayPickerInput, Row } from '@components';
import React from 'react';

export default function DateForm(props: any) {
  const {
    formField: { tripDate },
    formValues,
    setFieldValue,
    setFieldTouched,
  } = props;

  return (
    <>
      <Row>
        <Column xs={8} xsOffset={2}>
          <DayPickerInput
            label={tripDate.label}
            initialValues=""
            values={formValues}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
          />
        </Column>
      </Row>
    </>
  );
}
