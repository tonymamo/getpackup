import { useEffect, useCallback } from 'react';
import { useFormikContext } from 'formik';
import { debounce, isEqual } from 'lodash';

import usePrevious from '@utils/usePrevious';

const AutoSave = () => {
  const formik = useFormikContext();
  const debounceMs = 1000;

  const debouncedSubmit = useCallback(
    debounce(() => {
      if (formik.isValid) {
        formik.submitForm();
      }
    }, debounceMs),
    [debounceMs, formik.submitForm]
  );

  const prevValues = usePrevious(formik.values);
  useEffect(() => {
    if (prevValues && !isEqual(formik.values, prevValues)) {
      debouncedSubmit();
    }
  }, [formik.values]);

  return null;
};

export default AutoSave;
