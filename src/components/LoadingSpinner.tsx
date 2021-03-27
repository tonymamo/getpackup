import React, { FunctionComponent } from 'react';
import styled, {
  keyframes,
  ThemeProvider,
  ThemedStyledProps,
  CSSProperties,
} from 'styled-components';

import { darkSpinner, lightSpinner } from '@styles/color';

const CirclesKeyframes = (props: ThemedStyledProps<{}, { main: string }>) => keyframes`
  0% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.05),
    19px -19px 0 0 rgba(${props.theme.main}, 0.1),
    27px 0 0 0 rgba(${props.theme.main}, 0.2),
    19px 19px 0 0 rgba(${props.theme.main}, 0.3),
    0 27px 0 0 rgba(${props.theme.main}, 0.4),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.6),
    -27px 0 0 0 rgba(${props.theme.main}, 0.8),
    -19px -19px 0 0 rgba(${props.theme.main}, 1);
  }
  12.5% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 1),
    19px -19px 0 0 rgba(${props.theme.main}, 0.05),
    27px 0 0 0 rgba(${props.theme.main}, 0.1),
    19px 19px 0 0 rgba(${props.theme.main}, 0.2),
    0 27px 0 0 rgba(${props.theme.main}, 0.3),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.4),
    -27px 0 0 0 rgba(${props.theme.main}, 0.6),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.8);
  }
  25% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.8),
    19px -19px 0 0 rgba(${props.theme.main}, 1),
    27px 0 0 0 rgba(${props.theme.main}, 0.05),
    19px 19px 0 0 rgba(${props.theme.main}, 0.1),
    0 27px 0 0 rgba(${props.theme.main}, 0.2),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.3),
    -27px 0 0 0 rgba(${props.theme.main}, 0.4),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.6);
  }
  37.5% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.6),
    19px -19px 0 0 rgba(${props.theme.main}, 0.8),
    27px 0 0 0 rgba(${props.theme.main}, 1),
    19px 19px 0 0 rgba(${props.theme.main}, 0.05),
    0 27px 0 0 rgba(${props.theme.main}, 0.1),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.2),
    -27px 0 0 0 rgba(${props.theme.main}, 0.3),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.4);
  }
  50% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.4),
    19px -19px 0 0 rgba(${props.theme.main}, 0.6),
    27px 0 0 0 rgba(${props.theme.main}, 0.8),
    19px 19px 0 0 rgba(${props.theme.main}, 1),
    0 27px 0 0 rgba(${props.theme.main}, 0.05),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.1),
    -27px 0 0 0 rgba(${props.theme.main}, 0.2),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.3);
  }
  62.5% {
    box-shadow:
      0 -27px 0 0 rgba(${props.theme.main}, 0.3),
      19px -19px 0 0 rgba(${props.theme.main}, 0.4),
      27px 0 0 0 rgba(${props.theme.main}, 0.6),
      19px 19px 0 0 rgba(${props.theme.main}, 0.8),
      0 27px 0 0 rgba(${props.theme.main}, 1),
      -19px 19px 0 0 rgba(${props.theme.main}, 0.05),
      -27px 0 0 0 rgba(${props.theme.main}, 0.1),
      -19px -19px 0 0 rgba(${props.theme.main}, 0.2);
  }
  75% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.2),
    19px -19px 0 0 rgba(${props.theme.main}, 0.3),
    27px 0 0 0 rgba(${props.theme.main}, 0.4),
    19px 19px 0 0 rgba(${props.theme.main}, 0.6),
    0 27px 0 0 rgba(${props.theme.main}, 0.8),
    -19px 19px 0 0 rgba(${props.theme.main}, 1),
    -27px 0 0 0 rgba(${props.theme.main}, 0.05),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.1);
  }
  87.5% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.1),
    19px -19px 0 0 rgba(${props.theme.main}, 0.2),
    27px 0 0 0 rgba(${props.theme.main}, 0.3),
    19px 19px 0 0 rgba(${props.theme.main}, 0.4),
    0 27px 0 0 rgba(${props.theme.main}, 0.6),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.8),
    -27px 0 0 0 rgba(${props.theme.main}, 1),
    -19px -19px 0 0 rgba(${props.theme.main}, 0.05);
  }
  100% {
    box-shadow:
    0 -27px 0 0 rgba(${props.theme.main}, 0.05),
    19px -19px 0 0 rgba(${props.theme.main}, 0.1),
    27px 0 0 0 rgba(${props.theme.main}, 0.2),
    19px 19px 0 0 rgba(${props.theme.main}, 0.3),
    0 27px 0 0 rgba(${props.theme.main}, 0.4),
    -19px 19px 0 0 rgba(${props.theme.main}, 0.6),
    -27px 0 0 0 rgba(${props.theme.main}, 0.8),
    -19px -19px 0 0 rgba(${props.theme.main}, 1);
  }
`;

const StyledLoadingSpinner = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: ${(props) => CirclesKeyframes(props)} 1s linear infinite;
  transform: scale(0.35);
  margin-right: 8px;
`;

type LoadingSpinnerProps = {
  theme?: 'light' | 'dark';
  style?: CSSProperties;
};

const lightTheme = {
  main: lightSpinner,
};

const darkTheme = {
  main: darkSpinner,
};

const LoadingSpinner: FunctionComponent<LoadingSpinnerProps> = ({ theme, style }) => {
  let chosenTheme = lightTheme;

  if (theme === 'dark') {
    chosenTheme = darkTheme;
  }

  return (
    <ThemeProvider theme={chosenTheme}>
      <StyledLoadingSpinner style={style} />
    </ThemeProvider>
  );
};

export default LoadingSpinner;
