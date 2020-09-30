import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { useField, FieldMetaProps, FormikHelpers } from 'formik';
import Geosuggest from 'react-geosuggest';
import 'react-geosuggest/module/geosuggest.css';

import {
  inputHeight,
  inputPaddingY,
  inputPaddingX,
  halfSpacer,
  baseSpacer,
  borderRadius,
} from '../styles/size';
import { fontSizeBase, lineHeightBase, fontSizeSmall } from '../styles/typography';
import {
  textColor,
  brandDanger,
  brandDangerRGB,
  brandPrimary,
  brandPrimaryRGB,
} from '../styles/color';
import { baseBorderStyle, disabledStyle, visuallyHiddenStyle } from '../styles/mixins';
import poweredByGoogle from '../images/powered_by_google_on_white_hdpi.png';

type InputProps = {
  disabled?: boolean;
  id?: string;
  name: string;
  type: string;
  label: string;
  helpText?: string | JSX.Element;
  required?: boolean;
  hideLabel?: boolean;
} & FieldMetaProps<string> &
  FormikHelpers<string>;

const sharedStyles = css`
  display: block;
  width: 100%;
  height: ${(props: InputProps) => (props.type === 'textarea' ? 'auto' : inputHeight)};
  padding: ${inputPaddingY} ${inputPaddingX};
  font-size: ${fontSizeBase};
  line-height: ${lineHeightBase};
  color: ${textColor};
  background-color: #ffffff;
  background-image: none;
  border: ${baseBorderStyle};
  border-radius: ${borderRadius};
  transition: border-color 0.2s ease-in-out;

  ${(meta: FieldMetaProps<string>) =>
    meta &&
    meta.touched &&
    meta.error &&
    `
      border-color: ${brandDanger};
      border-width: 2px;
      box-shadow: 0 0 0 ${borderRadius} rgba(${brandDangerRGB},.25);
  `}

  &:focus {
    border-color: ${brandPrimary};
    border-width: 2px;
    outline: 0;
    box-shadow: 0 0 0 ${borderRadius} rgba(${brandPrimaryRGB}, 0.25);
  }

  /* Disabled state */
  ${(props: InputProps) => props.disabled && disabledStyle}
`;

const StyledInput = styled.input`
  ${sharedStyles}
`;

const StyledTextarea = styled.textarea`
  resize: none;
  min-height: ${inputHeight};
  ${sharedStyles}
`;

const StyledErrorMessage = styled.div`
  color: ${brandDanger};
  font-size: ${fontSizeSmall};
`;

const InputWrapper = styled.div`
  margin-bottom: ${baseSpacer};
  text-align: left;
  ${(props: { hidden?: boolean }) => props.hidden && `display: none;`}
  & .tooltip {
    padding: 0 ${halfSpacer};
  }
`;

const StyledGeosuggest = styled(Geosuggest)`
  & .geosuggest {
    position: relative;
    width: 100%;
    margin: 0;
  }

  & .geosuggest__input {
    box-shadow: none;
    ${sharedStyles}
  }
`;

const StyledLabel = styled.label`
  margin: 0;
  ${(props: { invalid: boolean; required: boolean; visuallyHidden?: boolean }) =>
    props.invalid &&
    `
    color: ${brandDanger};
  `}
  ${(props) =>
    props.required &&
    `
    &:after {
      content: ' *';
      color: ${brandDanger};
    }
  `}
  ${(props) => props.visuallyHidden && visuallyHiddenStyle}
`;

const Input: FunctionComponent<InputProps> = (props) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField<string>(props.name);

  let inputTypeToRender;

  switch (props.type) {
    case 'textarea':
      inputTypeToRender = (
        <StyledTextarea
          id={props.name}
          placeholder={props.label}
          rows={3}
          {...field}
          {...props}
          {...meta}
        />
      );
      break;
    case 'geosuggest':
      inputTypeToRender = (
        <>
          <StyledGeosuggest
            placeDetailFields={['geometry']}
            onSuggestSelect={(suggest: { label: string }) =>
              suggest && suggest.label
                ? props.setFieldValue(field.name, suggest.label)
                : props.setFieldValue(field.name, '')
            }
            id={props.name}
            {...field}
            {...props}
            {...meta}
            minLength={3}
            label={undefined}
            inputType="text"
          />
          <p style={{ margin: 0, textAlign: 'right' }}>
            <img src={poweredByGoogle} alt="powered by Google" style={{ height: 18 }} />
          </p>
        </>
      );
      break;
    case 'hidden':
      inputTypeToRender = <StyledInput id={props.name} {...field} {...props} {...meta} />;
      break;
    default:
      inputTypeToRender = (
        <StyledInput placeholder={props.label} id={props.name} {...field} {...props} {...meta} />
      );
      break;
  }
  return (
    <InputWrapper>
      <StyledLabel
        htmlFor={props.id || props.name}
        invalid={meta && meta.touched && meta.error != null}
        required={props.required || false}
        visuallyHidden={props.hideLabel}
      >
        {props.label}
      </StyledLabel>

      {inputTypeToRender}
      {props.helpText && <small>{props.helpText}</small>}
      {meta && meta.touched && meta.error && <StyledErrorMessage>{meta.error}</StyledErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
