import { RootState } from '@redux/ducks';
import { removeAttemptedPrivatePage } from '@redux/ducks/client';
import { brandPrimary } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { baseAndAHalfSpacer, borderRadius, halfSpacer } from '@styles/size';
import { fontFamilySansSerif, fontSizeBase } from '@styles/typography';
import { navigate } from 'gatsby';
import React, { FunctionComponent } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import styled from 'styled-components';

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
    border: ${baseBorderStyle};
  }

  & .mdl-button {
    font-family: ${fontFamilySansSerif};
    line-height: 1.5;
    padding: ${halfSpacer} ${baseAndAHalfSpacer};
    max-width: 100%;
    font-size: ${fontSizeBase};
    display: flex;
    justify-content: center;
  }

  & .firebaseui-idp-text {
    font-size: ${fontSizeBase};
  }

  & .firebaseui-link {
    color: ${brandPrimary};
  }
`;

type FirebaseAuthWrapperProps = {};

const FirebaseAuthWrapper: FunctionComponent<FirebaseAuthWrapperProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const client = useSelector((state: RootState) => state.client);

  const signInProviders =
    typeof window !== 'undefined'
      ? [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ]
      : [];

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: signInProviders,
    callbacks: {
      signInSuccessWithAuthResult: () => {
        if (client.location) {
          dispatch(removeAttemptedPrivatePage());
          navigate(client.location);
        } else {
          navigate('/app/trips');
        }
      },
    },
    tosUrl: 'https://getpackup.com/terms',
    privacyPolicyUrl: 'https://getpackup.com/privacy',
  };

  return (
    <StyledFirebaseAuthWrapper>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </StyledFirebaseAuthWrapper>
  );
};

export default FirebaseAuthWrapper;
