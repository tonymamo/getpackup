import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { useField, FieldMetaProps, FormikHelpers } from 'formik';
import * as icons from 'react-icons/all';

import { brandPrimary, lightGray, textColor } from '../styles/color';
import { doubleSpacer, baseSpacer } from '../styles/size';

type IconCheckboxProps = {
  id?: string;
  name: string;
  checked?: boolean;
  icon: string;
  label?: string;
  onChange: () => void;
} & FieldMetaProps<string> &
  FormikHelpers<string>;

const HiddenCheckboxInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  display: none;
`;

const IconWrapperLabel = styled.label<{
  checked?: boolean;
}>`
  text-align: center;
  cursor: pointer;
  font-size: ${doubleSpacer};
  margin: ${doubleSpacer} 0;
`;

const StyledLabel = styled.span`
  display: block;
  font-size: ${baseSpacer};
  margin-bottom: ${baseSpacer};
  color: ${(props: { checked?: boolean }) => (props.checked ? brandPrimary : textColor)};
`;

const IconCheckbox: FunctionComponent<IconCheckboxProps> = (props) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField<string>(props.name);

  const renderDynamicIcon = (comboName: string) => {
    const [, iconName] = comboName.split('/');
    const Icon = icons[iconName];
    return <Icon color={props.checked ? brandPrimary : lightGray} />;
  };

  return (
    <>
      <HiddenCheckboxInput
        type="checkbox"
        {...field}
        {...props}
        {...meta}
        id={props.name}
        checked={props.checked}
        onChange={props.onChange}
      />
      <IconWrapperLabel htmlFor={props.name} checked={props.checked}>
        {renderDynamicIcon(props.icon)}
        {props.label && <StyledLabel checked={props.checked}>{props.label}</StyledLabel>}
      </IconWrapperLabel>
    </>
  );
};

export default IconCheckbox;
