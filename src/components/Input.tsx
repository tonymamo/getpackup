import React, { FunctionComponent, useState } from 'react';
import styled, { css } from 'styled-components';
import { FieldMetaProps, FormikHelpers, useField } from 'formik';
import { FaEye, FaEyeSlash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import Select, { CommonProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import Geosuggest, { QueryType } from 'react-geosuggest';
import 'react-geosuggest/module/geosuggest.css';

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
} from '@styles/size';
import { fontSizeBase, lineHeightBase, fontSizeSmall } from '@styles/typography';
import {
  textColor,
  white,
  lightestGray,
  brandDanger,
  brandDangerRGB,
  brandPrimary,
  brandPrimaryRGB,
  lightGray,
  offWhite,
  brandSuccess,
} from '@styles/color';
import { baseBorderStyle, disabledStyle, visuallyHiddenStyle } from '@styles/mixins';
import poweredByGoogle from '@images/powered_by_google_on_white_hdpi.png';
import { formatPhoneNumberValue } from '@utils/phoneNumber';

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
  components?: any;
  geosuggestTypes?: QueryType[];
} & FieldMetaProps<string> &
  FormikHelpers<string> &
  CommonProps<OptionType | OptionType[]>;

export const sharedStyles = css`
  display: block;
  width: 100%;
  height: ${inputHeight};
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

export const StyledInput = styled.input`
  ${sharedStyles}
`;

const StyledTextarea = styled.textarea`
  resize: none;
  min-height: ${`${Number(inputHeight.replace('px', '')) * 3}px`};
  ${sharedStyles}
`;

const StyledErrorMessage = styled.div`
  color: ${brandDanger};
  font-size: ${fontSizeSmall};
`;

const StyledSelect = styled(Select)`
  & > div:first-child {
    ${(props: { invalid?: boolean }) =>
      props.invalid &&
      `
      border: 2px solid ${brandDanger};
  `}
  }
`;

const StyledAsyncSelect = styled(AsyncSelect)`
  & > div:first-child {
    ${(props: { invalid?: boolean }) =>
      props.invalid &&
      `
      border: 2px solid ${brandDanger};
  `}
  }
`;

export const InputWrapper = styled.div`
  margin-bottom: ${baseSpacer};
  text-align: left;
  ${(props: { hidden?: boolean }) => props.hidden && `display: none;`}
  & .tooltip {
    padding: 0 ${halfSpacer};
  }
`;

const StyledGeosuggest = styled(Geosuggest)`
  &.geosuggest {
    position: relative;
    width: 100%;
    margin: 0;
  }

  & .geosuggest__input {
    box-shadow: none;
    ${sharedStyles}
  }
`;

export const StyledLabel = styled.label<{
  hiddenLabel?: boolean;
  invalid?: boolean;
  required?: boolean;
}>`
  margin: 0;
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

const multiSelectStyles = {
  option: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    color: textColor,
    backgroundColor: state.isFocused ? offWhite : white,
    width: 'auto',
  }),
  control: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    minHeight: inputHeight,
    fontSize: fontSizeBase,
    lineHeight: lineHeightBase,
    color: textColor,
    backgroundColor: 'white',
    border: state.isFocused ? `2px solid ${brandPrimary}` : baseBorderStyle,
    boxShadow: state.isFocused && 'none',
    '&:hover': {
      border: state.isFocused ? `2px solid ${brandPrimary}` : baseBorderStyle,
    },
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    '&:hover': {
      backgroundColor: brandDanger,
      color: white,
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: textColor,
  }),
};

const Input: FunctionComponent<InputProps> = (props) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField<string>(props.name);
  // state for toggling password visibility
  const [passwordVisibility, setPasswordVisibiility] = useState(false);

  let inputTypeToRender;

  switch (props.type) {
    case 'select':
      {
        const onChange = (option: OptionType[] | OptionType) => {
          props.setFieldValue(
            field.name,
            // eslint-disable-next-line no-nested-ternary
            props.isMulti
              ? option
                ? (option as OptionType[]).map((item: OptionType) => item.value)
                : []
              : (option as OptionType).value
          );
        };

        const setValue = (value: string | Array<string>) => {
          return props.isMulti
            ? (value as Array<string>).map((item) =>
                props.options.find((option) => option.value === item)
              )
            : props.options.find((option) => option.value === value);
        };

        inputTypeToRender = (
          <StyledSelect
            className="react-select"
            styles={multiSelectStyles}
            isMulti={props.isMulti}
            menuPlacement="auto"
            value={setValue(field.value)}
            options={props.options}
            name={props.name}
            onChange={(option: OptionType) => onChange(option)}
            onBlur={() => props.setFieldTouched(props.name)}
            isDisabled={props.disabled}
            invalid={meta && meta.touched && meta.error}
          />
        );
      }
      break;
    case 'async-select':
      {
        const onChange = (option: OptionType[] | OptionType) => {
          props.setFieldValue(
            field.name,
            // eslint-disable-next-line no-nested-ternary
            props.isMulti
              ? option
                ? (option as OptionType[]).map((item: OptionType) => item.value)
                : []
              : (option as OptionType).value
          );
        };

        inputTypeToRender = (
          <StyledAsyncSelect
            components={props.components}
            className="react-select"
            cacheOptions
            loadOptions={props.loadOptions}
            defaultOptions
            styles={multiSelectStyles}
            isMulti={props.isMulti}
            menuPlacement="auto"
            onChange={(option: OptionType) => onChange(option)}
            name={props.name}
            onBlur={() => props.setFieldTouched(props.name)}
            isDisabled={props.disabled}
            invalid={meta && meta.touched && meta.error}
          />
        );
      }
      break;
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
            {props.checked ? <FaCheckCircle color={brandSuccess} /> : <FaRegCircle />}
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
    case 'tel':
      inputTypeToRender = (
        <StyledInput
          id={props.name}
          placeholder={typeof props.label === 'string' ? props.label : ''}
          {...field}
          {...props}
          {...meta}
          onChange={(event) => {
            field.onChange(event.target.name)(formatPhoneNumberValue(event.target.value));
          }}
        />
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
          rows={3}
          {...field}
          {...props}
          {...meta}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // stops form from being submitted if user hits enter key
              event.preventDefault();
            }
          }}
        />
      );
      break;
    case 'geosuggest':
      inputTypeToRender = (
        <>
          <StyledGeosuggest
            types={props.geosuggestTypes || []}
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
            label=""
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
    <InputWrapper hidden={props.type === 'hidden'}>
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
