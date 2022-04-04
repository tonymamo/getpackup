import React, { FunctionComponent, useState, useEffect, useCallback, useRef } from 'react';
import { useFormikContext } from 'formik';
import { debounce, isEqual } from 'lodash';
import { FaHourglassHalf, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

import usePrevious from '@utils/usePrevious';
import { brandDanger, brandPrimary, brandSuccess } from '@styles/color';

const opacityTransition = keyframes`
  0%, 100% {
    opacity: 0;
  }
  1%, 80% {
    opacity: 1;
  }
`;

const AutoSaveAnimationWrapper = styled.div`
  animation: ${opacityTransition} 3s ease-in-out 1;
`;

const AutoSave: FunctionComponent<{}> = () => {
  const formik = useFormikContext();
  const debounceMs = 1000;
  const [isSaving, setIsSaving] = useState(false);
  const [isMessageShowing, setIsMessageShowing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mounted = useRef(false);

  const debouncedSubmit = useCallback(
    debounce(() => {
      if (mounted.current) {
        setIsSaving(true);
        setIsMessageShowing(true);
        setHasError(false);
        if (formik.isValid) {
          formik.submitForm().then(
            () => {
              setIsSaving(false);
              setHasError(false);
            },
            () => {
              setIsSaving(false);
              setHasError(true);
            }
          );
        }
        setTimeout(() => {
          if (mounted.current) {
            setIsMessageShowing(false);
          }
        }, 3000);
      }
    }, debounceMs),
    [formik.submitForm]
  );

  const prevValues = usePrevious(formik.values);
  useEffect(() => {
    mounted.current = true; // Will set it to true on mount ...
    if (prevValues && !isEqual(formik.values, prevValues)) {
      debouncedSubmit();
    }
    return () => {
      mounted.current = false; // ... and to false on unmount
    };
  }, [formik.values]);

  if (isMessageShowing && formik.isValid) {
    return (
      <AutoSaveAnimationWrapper>
        {hasError ? (
          <p style={{ color: brandDanger, margin: 0 }}>
            <>
              <FaExclamationCircle /> Changes not saved, please try again.
            </>
          </p>
        ) : (
          <p style={{ margin: 0, color: isSaving ? brandPrimary : brandSuccess }}>
            {isSaving ? (
              <>
                <FaHourglassHalf /> Saving changes...
              </>
            ) : (
              <>
                <FaCheck /> Changes saved!
              </>
            )}
          </p>
        )}
      </AutoSaveAnimationWrapper>
    );
  }
  return <p style={{ margin: 0 }}>&nbsp;</p>;
};

export default AutoSave;
