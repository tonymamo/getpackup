import {
  brandDanger,
  brandPrimary,
  brandPrimaryHover,
  brandSecondary,
  brandSecondaryHover,
  brandSuccess,
  gray,
  lightGray,
  textColor,
  white,
} from '@styles/color';
import { baseBorderStyle, disabledStyle } from '@styles/mixins';
import {
  baseAndAHalfSpacer,
  baseSpacer,
  borderRadius,
  borderWidth,
  halfSpacer,
  inputHeight,
  quarterSpacer,
  threeQuarterSpacer,
} from '@styles/size';
import { fontFamilySansSerif, fontSizeBase } from '@styles/typography';
import { Link } from 'gatsby';
import React, { CSSProperties, FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import LoadingSpinner from './LoadingSpinner';

export type ButtonProps = {
  type: 'submit' | 'button' | 'reset' | 'link';
  color?:
    | 'text'
    | 'primary'
    | 'primaryOutline'
    | 'success'
    | 'successOutline'
    | 'danger'
    | 'dangerOutline'
    | 'secondary'
    | 'tertiary';
  rightSpacer?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
  to?: string;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
  isLoading?: boolean;
  style?: CSSProperties;
  size?: 'small' | 'large';
};

const primaryButtonStyles = `
  background-color: ${brandPrimary};
  color: ${white};
  
  &:hover,
  &:focus {
    color: ${white};
    background-color: ${brandPrimaryHover};
  }
`;

const primaryOutlineButtonStyles = `
  border-color: ${brandPrimary};
  background-color: ${white};
  color: ${brandPrimary};
  
  &:hover,
  &:focus {
    background-color: ${brandPrimary};
    color: ${white};
  }
`;

const primaryDisabledStyles = `
  background-color: ${lightGray};
  color: ${gray};
`;

const primaryOutlinedDisabledStyles = `
  background-color: ${white};
  border-color: ${lightGray};
  color: ${gray};
`;

const textDisabledStyles = `
  color: ${gray};
`;

const successButtonStyles = `
  background-color: ${brandSuccess};
  color: ${white};
  
  &:hover,
  &:focus {
    background-color: ${brandSuccess};
    filter: brightness(115%);
  }
`;

const successOutlineButtonStyles = `
  border-color: ${brandSuccess};
  color: ${brandSuccess};
  
  &:hover,
  &:focus {
    background-color: ${brandSuccess};
    color: ${white};
  }
`;

const dangerButtonStyles = `
  background-color: ${brandDanger};
  color: ${white};
  
  &:hover,
  &:focus {
    background-color: ${brandDanger};
    filter: brightness(115%);
  }
`;

const dangerOutlineButtonStyles = `
  background-color: ${white};
  border-color: ${brandDanger};
  color: ${brandDanger};
  
  &:hover,
  &:focus {
    background-color: ${brandDanger};
    color: ${white};
  }
`;

const textButtonStyles = `
  background-color: transparent;
  color: ${brandPrimary};
  padding: 0;
  vertical-align: initial;
  font-weight: normal;

  &:hover,
  &:focus {
    background-color: transparent;
    color: ${brandPrimaryHover};
    text-decoration: none;
  }
`;

const secondaryButtonStyles = `
  background-color: ${brandSecondary};
  color: ${white};
  
  &:hover,
  &:focus {
    color: ${white};
    background-color: ${brandSecondaryHover};
  }
`;

const tertiaryButtonStyles = `
  background-color: ${white};
  color: ${textColor};
  border: ${baseBorderStyle};
  
  &:hover,
  &:focus {
    color: ${textColor};
    background-color: ${white};
  }
`;

const allStyles = css`
  position: relative;
  display: inline-flex;
  ${(props: ButtonProps) => props.block && 'width: 100%;'}
  font-family: ${fontFamilySansSerif};
  font-weight: bold;
  font-size: ${fontSizeBase};
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  border: ${borderWidth} solid transparent;
  letter-spacing: 1px;
  line-height: 1.5;
  padding: ${(props) =>
    props.size === 'small'
      ? `${quarterSpacer} ${threeQuarterSpacer}`
      : `${halfSpacer} ${baseAndAHalfSpacer}`};
  height: ${(props) => (props.size === 'small' ? 'auto' : inputHeight)};
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  border-radius: ${borderRadius};

  /* Color */
  ${primaryButtonStyles}
  ${(props: ButtonProps) => props.color === 'primaryOutline' && primaryOutlineButtonStyles}
  ${(props: ButtonProps) => props.color === 'danger' && dangerButtonStyles}
  ${(props: ButtonProps) => props.color === 'dangerOutline' && dangerOutlineButtonStyles}
  ${(props: ButtonProps) => props.color === 'success' && successButtonStyles}
  ${(props: ButtonProps) => props.color === 'successOutline' && successOutlineButtonStyles}
  ${(props: ButtonProps) => props.color === 'text' && textButtonStyles}
  ${(props: ButtonProps) => props.color === 'secondary' && secondaryButtonStyles}
  ${(props: ButtonProps) => props.color === 'tertiary' && tertiaryButtonStyles}

  /* Disabled - specific color variations */
  ${(props: ButtonProps) => props.color === 'primary' && props.disabled && primaryDisabledStyles}
  ${(props: ButtonProps) =>
    props.color === 'primaryOutline' && props.disabled && primaryOutlinedDisabledStyles}
  ${(props: ButtonProps) => props.color === 'text' && props.disabled && textDisabledStyles}

  /* Disabled state for all other variations: adds opacity and cursor/pointer-events styling */
  ${(props: ButtonProps) => props.disabled && disabledStyle}

  /* When button is next to other items, use rightSpacer give them some breathing room */
  ${(props: ButtonProps) => props.rightSpacer && `margin-right: ${baseSpacer};`}
  
  &:active,
  &:focus {
    outline: none;
    filter: brightness(0.85);
  }
`;

const StyledButton = styled.button`
  ${allStyles}
`;

const StyledLink = styled.span`
  ${allStyles}
  padding: 0; /* remove padding from parent div and use in <a> below */

  & > a {
    padding: ${(props: ButtonProps) =>
      props.size === 'small'
        ? `${quarterSpacer} ${threeQuarterSpacer}`
        : `${halfSpacer} ${baseAndAHalfSpacer}`};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: inherit !important;

    &:hover,
    &:focus {
      color: inherit !important;
    }
  }
`;

const Button: FunctionComponent<ButtonProps> = ({
  color,
  rightSpacer,
  to,
  children,
  type,
  onClick,
  disabled,
  iconLeft,
  iconRight,
  block,
  isLoading,
  style,
  size,
  ...rest
}) => {
  if (type === 'link' && to) {
    return (
      <StyledLink
        color={color}
        rightSpacer={rightSpacer}
        disabled={disabled}
        block={block}
        type={type}
        style={style}
        size={size}
        onClick={onClick} // so we can track analytics if passed in on Button Links
        {...rest}
      >
        {!to.startsWith('sms') && !to.includes('mailto') ? (
          <Link to={to}>
            {iconLeft}&nbsp;{children}&nbsp;{iconRight}
          </Link>
        ) : (
          <a href={to}>
            {iconLeft}&nbsp;{children}&nbsp;{iconRight}
          </a>
        )}
      </StyledLink>
    );
  }

  if (type !== 'link') {
    return (
      <StyledButton
        type={type}
        color={color}
        rightSpacer={rightSpacer}
        onClick={onClick}
        block={block}
        disabled={disabled || isLoading}
        style={style}
        size={size}
        {...rest}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && iconLeft}&nbsp;{children}&nbsp;{!isLoading && iconRight}
      </StyledButton>
    );
  }
  return null;
};

export default Button;
