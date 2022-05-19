import { Alert } from '@components';
import { FormikErrors } from 'formik';
import { isEmpty } from 'lodash';
import React, { FunctionComponent } from 'react';

type FormErrorsProps = {
  dirty: boolean;
  errors: FormikErrors<{
    [key: string]: string | boolean;
  }>;
};

const FormErrors: FunctionComponent<FormErrorsProps> = ({ dirty, errors }) => {
  const hasMissingRequiredFields = Object.values(errors).some((err) => err?.includes('required'));

  if (dirty && !isEmpty(errors) && !hasMissingRequiredFields) {
    return <Alert type="danger" message={Object.values(errors)[0] as string} />;
  }

  if (dirty && !isEmpty(errors) && hasMissingRequiredFields) {
    return <Alert type="danger" message="Please fill out all of the required fields." />;
  }
  return null;
};

export default FormErrors;
