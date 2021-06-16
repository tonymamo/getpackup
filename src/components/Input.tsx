import React, { FunctionComponent, useState } from 'react';
import styled, { css } from 'styled-components';
import { FieldMetaProps, FormikHelpers, useField } from 'formik';
import { FaEye, FaEyeSlash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

import {
  baseSpacer,
  borderRadius,
  doubleSpacer,
  halfSpacer,
  sextupleSpacer,
  quarterSpacer,
  quadrupleSpacer,
  inputHeight,
  inputPaddingX,
  inputPaddingY,
  baseAndAHalfSpacer,
} from '@styles/size';
import { lineHeightBase, fontSizeSmall, fontSizeH6 } from '@styles/typography';
import {
  textColor,
  white,
  lightestGray,
  brandDanger,
  brandDangerRGB,
  brandPrimary,
  brandPrimaryRGB,
  lightGray,
  brandSuccess,
} from '@styles/color';
import { baseBorderStyle, disabledStyle, visuallyHiddenStyle } from '@styles/mixins';

type OptionType = { label: string; value: string };

type InputProps = {
  disabled?: boolean;
  id?: string;
  name: string;
  square?: boolean;
  hiddenLabel?: boolean;
  type: string;
  label: string | JSX.Element;
  helpText?: string | JSX.Element;
  checked?: boolean;
  options?: OptionType[];
  required?: boolean;
  loadOptions?: () => void;
  defaultOptions?: OptionType[] | boolean;
  components?: any;

  placeholder?: string;
  noMarginOnWrapper?: boolean;
} & FieldMetaProps<string> &
  FormikHelpers<string>;

export const sharedStyles = css`
  display: block;
  width: 100%;
  height: ${inputHeight};
  padding: ${inputPaddingY} ${inputPaddingX};
  /* helps prevent zooming when inputs are focused on mobile safari to have it be above 16px */
  /* https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone */
  font-size: ${fontSizeH6};
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

export const StyledInput = styled.input`
  ${sharedStyles}
`;

const StyledTextarea = styled.textarea`
  resize: none;
  min-height: ${`${Number(inputHeight.replace('px', '')) * 2}px`};
  ${sharedStyles}
`;

const StyledErrorMessage = styled.div`
  color: ${brandDanger};
  font-size: ${fontSizeSmall};
`;

export const InputWrapper = styled.div`
  margin-bottom: ${(props: { noMarginOnWrapper?: boolean; hidden?: boolean }) =>
    props.noMarginOnWrapper ? 0 : baseSpacer};
  text-align: left;
  ${(props) => props.hidden && `display: none;`}
  & .tooltip {
    padding: 0 ${halfSpacer};
  }
`;

export const StyledLabel = styled.label<{
  hiddenLabel?: boolean;
  invalid?: boolean;
  required?: boolean;
}>`
  margin: 0;
  font-weight: bold;
  font-size: ${fontSizeSmall};
  text-transform: uppercase;
  ${(props) => props.hiddenLabel && visuallyHiddenStyle}
  ${(props) =>
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

const StyledToggle = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  &:checked + label {
    background: ${brandPrimary};
  }
  &:checked + label:after {
    left: calc(100% - 5px);
    transform: translateX(-100%);
  }
`;

const StyledToggleLabel = styled.label<{
  checked?: boolean;
  disabled?: boolean;
}>`
  cursor: pointer;
  width: ${sextupleSpacer};
  height: 42px;
  background: ${lightGray};
  display: inline-block;
  border-radius: 42px;
  position: relative;
  margin: 0;

  &:after {
    content: '${(props) => (props.checked ? 'Yes' : 'No')}';
    position: absolute;
    top: 5px;
    left: 5px;
    width: ${doubleSpacer};
    height: ${doubleSpacer};
    background: ${white};
    border-radius: ${doubleSpacer};
    transition: 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${fontSizeSmall};
    color: ${(props) => (props.checked ? brandPrimary : textColor)};
  }

  /* Disabled state */
  ${(props) => props.disabled && disabledStyle}
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: ${quadrupleSpacer};
  height: ${inputHeight};
  background: ${lightestGray};
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${baseBorderStyle};
  padding: 0 ${quarterSpacer};
  border-radius: 0 ${borderRadius} ${borderRadius} 0;
`;

const Input: FunctionComponent<InputProps> = (props) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField<string>(props.name);
  // state for toggling password visibility
  const [passwordVisibility, setPasswordVisibiility] = useState(false);

  let inputTypeToRender;

  switch (props.type) {
    case 'checkbox':
      inputTypeToRender = (
        <>
          <StyledLabel htmlFor={props.id || props.name}>
            <StyledToggle
              {...field}
              {...props}
              {...meta}
              id={props.name}
              checked={props.checked}
              type="checkbox"
            />
            {props.checked ? (
              <FaCheckCircle
                color={brandSuccess}
                size={baseAndAHalfSpacer}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <FaRegCircle size={baseAndAHalfSpacer} style={{ cursor: 'pointer' }} />
            )}
            &nbsp;&nbsp;
            {props.label}
          </StyledLabel>
        </>
      );
      break;
    case 'toggle':
      inputTypeToRender = (
        <>
          <StyledLabel htmlFor={props.id || props.name}>{props.label}</StyledLabel>
          <StyledToggle
            {...field}
            {...props}
            {...meta}
            id={props.name}
            checked={props.checked}
            type="checkbox"
          />
          <StyledToggleLabel
            htmlFor={props.name}
            disabled={props.disabled}
            checked={props.checked}
          />
        </>
      );
      break;
    case 'password':
      inputTypeToRender = (
        <PasswordWrapper>
          <StyledInput
            placeholder={typeof props.label === 'string' ? props.label : ''}
            id={props.name}
            {...field}
            {...props}
            {...meta}
          />
          <PasswordToggle onClick={() => setPasswordVisibiility(!passwordVisibility)}>
            {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
          </PasswordToggle>
          {passwordVisibility && field.value.length > 0 && (
            <span style={{ marginLeft: baseSpacer }}>{field.value}</span>
          )}
        </PasswordWrapper>
      );
      break;
    case 'textarea':
      inputTypeToRender = (
        <StyledTextarea
          id={props.name}
          placeholder={typeof props.label === 'string' ? props.label : ''}
          rows={2}
          {...field}
          {...props}
          {...meta}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // stops form from being submitted if user hits enter key
              event.stopPropagation();
            }
          }}
        />
      );
      break;
    case 'hidden':
      inputTypeToRender = <StyledInput id={props.name} {...field} {...props} {...meta} />;
      break;
    default:
      inputTypeToRender = (
        <StyledInput
          placeholder={typeof props.label === 'string' ? props.label : ''}
          id={props.name}
          {...field}
          {...props}
          {...meta}
        />
      );
      break;
  }
  return (
    <InputWrapper hidden={props.type === 'hidden'} noMarginOnWrapper={props.noMarginOnWrapper}>
      {props.label && props.type !== 'toggle' && props.type !== 'checkbox' && (
        <StyledLabel
          htmlFor={props.id || props.name}
          hiddenLabel={props.hiddenLabel}
          invalid={meta && meta.touched && meta.error != null}
          required={props.required || false}
        >
          {props.label}
        </StyledLabel>
      )}
      {inputTypeToRender}
      {props.helpText && <small>{props.helpText}</small>}
      {meta && meta.touched && meta.error && !props.square && (
        <StyledErrorMessage>{meta.error}</StyledErrorMessage>
      )}
    </InputWrapper>
  );
};

export default Input;
