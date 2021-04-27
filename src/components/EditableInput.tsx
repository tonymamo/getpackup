import React, { FunctionComponent, useState } from 'react';
import { useFormikContext } from 'formik';

import { FlexContainer, Button, FormErrors, HorizontalRule } from '@components';
import trackEvent from '@utils/trackEvent';

type EditableComponentProps = {
  label: string;
  isLoading: boolean;
  value: string | JSX.Element;
};

const EditableComponent: FunctionComponent<EditableComponentProps> = ({
  label,
  isLoading,
  value,
  children,
}) => {
  // Manage the state whether to show the label or the input. By default, label will be shown.
  const [isEditing, setIsEditing] = useState(false);
  const { isSubmitting, isValid, dirty, submitForm, errors } = useFormikContext();

  return (
    <section>
      <FlexContainer justifyContent="space-between">
        <p>
          <strong>{label}</strong>
        </p>
        <p>
          <Button
            type="button"
            color="text"
            onClick={() => {
              trackEvent(`EditableInput - ${isEditing ? 'Cancel' : 'Edit'} ${label} Clicked`, {
                label,
                value,
              });
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </p>
      </FlexContainer>

      {isEditing ? (
        <div>
          {children}
          <FormErrors dirty={dirty} errors={errors as string[]} />
          <Button
            type="button"
            color="success"
            onClick={() => {
              submitForm().then(
                () => {
                  setIsEditing(!isEditing);
                },
                () => {
                  setIsEditing(!isEditing);
                }
              );
            }}
            isLoading={isLoading}
            disabled={isSubmitting || !isValid || isLoading}
          >
            Save
          </Button>
        </div>
      ) : (
        <>{typeof value === 'string' ? <p>{value}</p> : value}</>
      )}
      <HorizontalRule />
    </section>
  );
};
export default EditableComponent;
