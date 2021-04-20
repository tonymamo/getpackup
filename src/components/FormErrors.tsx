import React, { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';

import { Alert } from '@components';

type FormErrorsProps = {
  dirty: boolean;
  errors: string[];
};

const FormErrors: FunctionComponent<FormErrorsProps> = ({ dirty, errors }) => {
  const hasMissingRequiredFields = Object.values(errors).some((err) => err.includes('required'));

  if (dirty && !isEmpty(errors) && !hasMissingRequiredFields) {
    return <Alert type="danger" message="Please fix the errors above." />;
  }

  if (dirty && !isEmpty(errors) && hasMissingRequiredFields) {
    return <Alert type="danger" message="Please fill out all of the required fields." />;
  }
  return null;
};

export default FormErrors;
