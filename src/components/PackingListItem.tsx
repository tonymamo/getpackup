import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer } from '@styles/size';
import Input from './Input';

type PackingListItemProps = {
  isPacked: boolean;
  name: string;
  category: string;
};

const PackingListItemWrapper = styled.div`
  border-bottom: ${baseBorderStyle};
  padding-top: ${baseSpacer};
`;

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{ [props.name]: { isPacked: props.isPacked } }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values }) => (
          <Form>
            <Field
              as={Input}
              name={`${props.name}.isPacked`}
              type="checkbox"
              checked={values[props.name].isPacked}
              label={props.name}
            />
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
