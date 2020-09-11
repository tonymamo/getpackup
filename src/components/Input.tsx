import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { useField, FieldMetaProps, FormikHelpers } from 'formik';

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
  white,
  brandDanger,
  brandDangerRGB,
  brandPrimary,
  brandPrimaryRGB,
} from '../styles/color';
import { baseBorderStyle, disabledStyle } from '../styles/mixins';

type InputProps = {
  disabled?: boolean;
  id?: string;
  name: string;
  type: string;
  label: string | JSX.Element;
  helpText?: string | JSX.Element;
  required?: boolean;
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
  background-color: ${white};
  background-image: none;
  border: ${baseBorderStyle};
  border-radius: ${borderRadius};
  transition: border-color .2s ease-in-out;

  ${(meta: FieldMetaProps<string>) =>
    meta &&
    meta.touched &&
    meta.error &&
    `
      border-color: ${brandDanger};
      border-width: 2px;
      // box-shadow: 0 0 0 ${borderRadius} rgba(${brandDangerRGB},.25);
  `}
  
  &:focus {
    border-color: ${brandPrimary};
    border-width: 2px;
    outline: 0;
    /* box-shadow: 0 0 0 ${borderRadius} rgba(${brandPrimaryRGB},.25); */
  }
  
  /* Disabled state */
  ${(props: InputProps) => props.disabled && disabledStyle}
`;

const StyledInput = styled.input`
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

const StyledLabel = styled.label`
  margin: 0;
  ${(props: { invalid: boolean; required: boolean }) =>
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
`;

const Input: FunctionComponent<InputProps> = (props) => {
  const [field, meta] = useField<string>(props.name);
  return (
    <InputWrapper>
      <StyledLabel
        htmlFor={props.id || props.name}
        invalid={meta && meta.touched && meta.error != null}
        required={props.required || false}
      >
        {props.label}
      </StyledLabel>

      <StyledInput id={props.name} {...field} {...props} {...meta} />
      {props.helpText && <small>{props.helpText}</small>}
      {meta && meta.touched && meta.error && <StyledErrorMessage>{meta.error}</StyledErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
