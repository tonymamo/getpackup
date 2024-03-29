import 'react-geosuggest/module/geosuggest.css';

import poweredByGoogle from '@images/powered_by_google_on_white_hdpi.png';
import {
  brandDanger,
  brandDangerRGB,
  brandPrimary,
  brandPrimaryRGB,
  brandSuccess,
  lightGray,
  lightestGray,
  offWhite,
  textColor,
  textColorLight,
  white,
} from '@styles/color';
import { baseBorderStyle, disabledStyle, visuallyHiddenStyle } from '@styles/mixins';
import {
  baseAndAHalfSpacer,
  baseSpacer,
  borderRadius,
  doubleSpacer,
  halfSpacer,
  inputHeight,
  inputPaddingX,
  inputPaddingY,
  quadrupleSpacer,
  quarterSpacer,
  sextupleSpacer,
} from '@styles/size';
import { fontSizeH6, fontSizeSmall, lineHeightBase } from '@styles/typography';
import { formatPhoneNumberValue } from '@utils/phoneNumber';
import { FieldMetaProps, FormikHelpers, useField } from 'formik';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Geosuggest, { QueryType, Suggest } from 'react-geosuggest';
import { FaCheckCircle, FaEye, FaEyeSlash, FaRegCircle } from 'react-icons/fa';
import NumericInput from 'react-numeric-input';
import Select, { CommonProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import styled, { css } from 'styled-components';

import LoadingSpinner from './LoadingSpinner';

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
  geosuggestTypes?: QueryType[];
  placeholder?: string;
  noMarginOnWrapper?: boolean;
} & FieldMetaProps<string> &
  FormikHelpers<string> &
  CommonProps<OptionType | OptionType[], boolean>;

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
  margin-bottom: ${(props: { noMarginOnWrapper?: boolean; hidden?: boolean }) =>
    props.noMarginOnWrapper ? 0 : baseSpacer};
  text-align: left;
  ${(props) => props.hidden && `display: none;`}
  & .tooltip {
    padding: 0 ${halfSpacer};
  }
`;

const StyledGeosuggest = styled(Geosuggest)<any>`
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
  display: flex;
  line-height: 1.75;
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

const StyledNumericInputWrapper = styled.div`
  & .react-numeric-input {
    background: ${white};
    border-radius: ${borderRadius};
    width: 100%;
    height: ${inputHeight};
    position: relative;
    display: block;
  }
  & input {
    border-radius: ${borderRadius};
    width: 100%;
    color: ${textColor};
    border: ${baseBorderStyle};
    display: block;
    height: ${inputHeight};
    padding: 0 ${inputHeight};
    text-align: center;
    font-size: ${fontSizeH6};
  }
  & input:focus {
    outline: none;
    border-color: ${brandPrimary};
    border-width: 2px;
    box-shadow: 0 0 0 ${borderRadius} rgba(${brandPrimaryRGB}, 0.25);
  }
  & b {
    position: absolute;
    top: 2px;
    height: 46px;
    width: 46px;
    background-color: ${lightestGray};
    border-radius: ${borderRadius};
    color: ${textColor};
  }
  & b:nth-of-type(1) {
    right: 2px;
  }
  & b:nth-of-type(2) {
    left: 2px;
  }
  & b i:nth-child(1) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 2px;
    background: ${textColor};
    margin: -1px 0px 0px -5px;
  }
  & b i:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 10px;
    background: ${textColor};
    margin: -5px 0px 0px -1px;
  }
`;

export const multiSelectStyles = {
  option: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    color: textColor,
    backgroundColor: state.isFocused ? offWhite : white,
    width: 'auto',
    '&:active': {
      backgroundColor: `rgba(${brandPrimaryRGB}, .25)`,
    },
  }),
  control: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    minHeight: inputHeight,
    fontSize: '1.1em', // 1em makes it slightly smaller than 16px at smaller viewports, causing a zoom issue
    lineHeight: lineHeightBase,
    color: textColor,
    backgroundColor: 'white',
    border: state.isFocused ? `2px solid ${brandPrimary}` : baseBorderStyle,
    boxShadow: state.isFocused ? `0 0 0 ${borderRadius} rgba(${brandPrimaryRGB}, 0.25)` : 'none',
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
    color: textColorLight,
  }),
};

const Input: FunctionComponent<InputProps> = (props) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField<string>(props.name);
  // state for toggling password visibility
  const [passwordVisibility, setPasswordVisibiility] = useState(false);

  let inputTypeToRender;

  useEffect(() => {
    // Override react-numeric-input type
    if (props.type === 'number') {
      const input = document.querySelector('.react-numeric-input input');
      // eslint-disable-next-line no-unused-expressions
      input?.setAttribute('type', 'number');
    }
  }, [props.type]);

  switch (props.type) {
    case 'number':
      inputTypeToRender = (
        <StyledNumericInputWrapper>
          <NumericInput
            mobile
            strict
            step={1}
            min={1}
            max={99}
            // eslint-disable-next-line react/style-prop-object
            style={false}
            id={props.name}
            value={props.value}
            onChange={(value) => props.setFieldValue(field.name, Number(value))}
          />
        </StyledNumericInputWrapper>
      );
      break;
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
            loadOptions={props.loadOptions}
            cacheOptions
            defaultOptions={props.defaultOptions || true}
            styles={multiSelectStyles}
            isMulti={props.isMulti}
            menuPlacement="auto"
            placeholder={props.placeholder || 'Start typing...'}
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
      {
        const iconStyles = {
          flexShrink: 0,
          cursor: 'pointer',
          marginRight: halfSpacer,
        };
        const renderCheckbox = (checked: boolean) =>
          checked ? (
            <FaCheckCircle color={brandSuccess} size={baseAndAHalfSpacer} style={iconStyles} />
          ) : (
            <FaRegCircle size={baseAndAHalfSpacer} style={iconStyles} />
          );
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

              {renderCheckbox(Boolean(props.checked))}
              {props.label}
            </StyledLabel>
          </>
        );
      }
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
    case 'username':
      inputTypeToRender = (
        <StyledInput
          id={props.name}
          maxLength={30}
          placeholder={typeof props.label === 'string' ? props.label : ''}
          {...field}
          {...props}
          {...meta}
          onKeyDown={(event) => {
            if (event.key === ' ') {
              event.preventDefault();
            }
          }}
          onChange={(event) => {
            field.onChange(event.target.name)(event.target.value.replace(/\s/g, '').toLowerCase());
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
    case 'geosuggest':
      inputTypeToRender = (
        <>
          {typeof window !== 'undefined' && window.google ? (
            <StyledGeosuggest
              types={props.geosuggestTypes || []}
              onSuggestSelect={(suggest: Suggest) => {
                if (suggest && suggest.location) {
                  props.setFieldValue('lat', suggest.location?.lat);
                  props.setFieldValue('lng', suggest.location?.lng);
                }

                return suggest && suggest.label
                  ? props.setFieldValue(field.name, suggest.label)
                  : props.setFieldValue(field.name, '');
              }}
              id={props.name}
              {...field}
              {...props}
              {...meta}
              // https://github.com/ubilabs/react-geosuggest#placedetailfields
              // don't return any place fields to keep biling costs down
              placeDetailFields={[]}
              onBlur={() => props.setFieldTouched(props.name)}
              minLength={3}
              label=""
            />
          ) : (
            <>
              <StyledInput
                placeholder="Search places"
                id={props.name}
                {...field}
                {...props}
                {...meta}
                disabled
              />
              <small>
                <LoadingSpinner theme="dark" /> Loading Google Maps...
              </small>
            </>
          )}
          <p style={{ margin: 0, float: 'right' }}>
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
