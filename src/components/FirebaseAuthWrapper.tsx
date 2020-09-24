import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import firebase from 'gatsby-plugin-firebase';

import { fontFamilySansSerif, fontSizeBase } from '../styles/typography';
import { halfSpacer, baseAndAHalfSpacer, borderRadius } from '../styles/size';

// Wrapper around 'react-firebaseui/StyledFirebaseAuth' just to modify some styling
// to make buttons match better to Button.tsx

const StyledFirebaseAuthWrapper = styled.div`
  & .firebaseui-container {
    max-width: 100%;
    font-size: ${fontSizeBase};
  }

  & .firebaseui-card-content {
    padding: 0;
  }

  & .firebaseui-idp-list {
    margin: 0;
  }

  & .firebaseui-idp-button {
    border-radius: ${borderRadius};
    box-shadow: none;
  }

  & .mdl-button {
    font-family: ${fontFamilySansSerif};
    line-height: 1.5;
    padding: ${halfSpacer} ${baseAndAHalfSpacer};
    max-width: 100%;
    font-size: ${fontSizeBase};
  }

  & .firebaseui-idp-text {
    font-size: ${fontSizeBase};
  }
`;

type FirebaseAuthWrapperProps = {};

const signInProviders =
  typeof window !== 'undefined'
    ? [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      ]
    : [];

export const uiConfig = {
  signInFlow: 'popup',
  signInOptions: signInProviders,
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const FirebaseAuthWrapper: FunctionComponent<FirebaseAuthWrapperProps> = (props) => (
  <StyledFirebaseAuthWrapper>{props.children}</StyledFirebaseAuthWrapper>
);

export default FirebaseAuthWrapper;
