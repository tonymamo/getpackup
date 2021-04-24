import React, { FunctionComponent, useState } from 'react';
import { useFormikContext } from 'formik';

import { FlexContainer, Button, FormErrors, HorizontalRule } from '@components';
import trackEvent from '@utils/trackEvent';

type EditableComponentProps = {
  label: string;
  isLoading: boolean;
  value: string | JSX.Element;
};

const EditableComponent: FunctionComponent<EditableComponentProps> = (props) => {
  // Manage the state whether to show the label or the input. By default, label will be shown.
  const [isEditing, setIsEditing] = useState(false);
  const { isSubmitting, isValid, dirty, submitForm, errors } = useFormikContext();

  return (
    <section>
      <FlexContainer justifyContent="space-between">
        <p>
          <strong>{props.label}</strong>
        </p>
        <p>
          <Button
            type="button"
            color="text"
            onClick={() => {
              trackEvent(
                `EditableInput - ${isEditing ? 'Cancel' : 'Edit'} ${props.label} Clicked`,
                { label: props.label, value: props.value }
              );
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </p>
      </FlexContainer>

      {isEditing ? (
        <div>
          {props.children}
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
            isLoading={props.isLoading}
            disabled={isSubmitting || !isValid || props.isLoading}
          >
            Save
          </Button>
        </div>
      ) : (
        <p>{props.value}</p>
      )}
      <HorizontalRule />
    </section>
  );
};
export default EditableComponent;
