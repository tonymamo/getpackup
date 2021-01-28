import React, { FunctionComponent, useEffect, useState } from 'react';
import { Router } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { FaBullhorn, FaCheck, FaTimes } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import ReactTooltip from 'react-tooltip';

import Profile from '@views/Profile';
import Trips from '@views/Trips';
import NewTripSummary from '@views/NewTripSummary';
import EditTripSummary from '@views/EditTripSummary';
import TripById from '@views/TripById';
import TripGenerator from '@views/TripGenerator';
import Search from '@views/Search';
import ShoppingList from '@views/ShoppingList';
import { RootState } from '@redux/ducks';
import {
  PrivateRoute,
  LoadingPage,
  ErrorBoundary,
  Input,
  Row,
  Button,
  Column,
  Modal,
  Heading,
} from '@components';
import { breakpoints, baseSpacer, tripleSpacer } from '@styles/size';
import { brandTertiary, brandTertiaryHover, offWhite, white } from '@styles/color';
import { baseBorderStyle, z1Shadow, z2Shadow } from '@styles/mixins';
import { requiredField } from '@utils/validations';
import postFormUrlEncoded from '@utils/postFormUrlEncoded';
import { addAlert } from '@redux/ducks/globalAlerts';
import { zIndexFeedbackButton } from '@styles/layers';

export const AppContainer = styled.div`
  padding: ${baseSpacer} 0;
  margin-right: auto;
  margin-left: auto;
  max-width: ${breakpoints.xl};
  background-color: ${offWhite};
  border: ${baseBorderStyle};
  min-height: 100vh;
`;

const FeedbackLink = styled.div`
  position: fixed;
  top: calc(6px + env(safe-area-inset-top));
  right: 4px;
  width: ${tripleSpacer};
  height: ${tripleSpacer};
  border-radius: ${tripleSpacer};
  color: ${white};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: ${z1Shadow};
  z-index: ${zIndexFeedbackButton};

  &:hover {
    background-color: ${brandTertiaryHover};
    box-shadow: ${z2Shadow};
  }

  @media only screen and (min-width: ${breakpoints.md}) {
    top: calc(72px + env(safe-area-inset-top));
    background-color: ${brandTertiary};
  }
`;

const App: FunctionComponent<{
  location?: {
    state: {
      pathname: string;
    };
  };
}> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isLoaded(auth) && auth.uid) {
      if (
        ((activeLoggedInUser !== undefined && !activeLoggedInUser.username) ||
          activeLoggedInUser === undefined) &&
        isLoaded(profile)
      ) {
        firebase
          .firestore()
          .collection('users')
          .doc(auth.uid)
          .set({
            uid: auth.uid,
            email: auth.email,
            displayName: auth.displayName,
            photoURL: auth.photoURL,
            username: `${auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '')}${Math.floor(
              100000 + Math.random() * 900000
            )}`,
            bio: '',
            website: '',
            location: '',
          });
      }
    }
  }, [auth, loggedInUser]);

  if (!auth.isLoaded || !loggedInUser || activeLoggedInUser === undefined) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/app" primary={false}>
          <PrivateRoute path="/profile" component={Profile} loggedInUser={activeLoggedInUser} />
          <PrivateRoute path="/trips" component={Trips} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/trips/new"
            component={NewTripSummary}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute path="/trips/:id" component={TripById} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/trips/:id/edit"
            component={EditTripSummary}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/generator"
            component={TripGenerator}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute path="/search" component={Search} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/shopping-list"
            component={ShoppingList}
            loggedInUser={activeLoggedInUser}
          />
        </Router>
      </ErrorBoundary>
      <FeedbackLink
        onClick={() => setModalIsOpen(true)}
        data-tip="Leave Feedback"
        data-for="feedback"
      >
        <FaBullhorn />
        <ReactTooltip
          id="feedback"
          place="left"
          type="dark"
          effect="solid"
          className="tooltip customTooltip"
          delayShow={500}
        />
      </FeedbackLink>
      <Modal
        toggleModal={() => {
          setModalIsOpen(false);
        }}
        isOpen={modalIsOpen}
      >
        <Formik
          validateOnMount
          initialValues={{
            email: auth.email || '',
            displayName: auth.displayName || '',
            page: props.location?.state?.pathname || '',
            message: '',
          }}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            postFormUrlEncoded('feedback', values)
              .then(() => {
                setSent(true);
                setSubmitting(false);
                resetForm();
              })
              .catch((err) => {
                dispatch(
                  addAlert({
                    type: 'danger',
                    message: err.message,
                  })
                );
              });
          }}
        >
          {({ isSubmitting, isValid, values }) => (
            <Form name="feedback" method="post" netlify-honeypot="bot-field" data-netlify="true">
              <input type="hidden" name="form-name" value="feedback" />
              <input type="hidden" name="email" value={values.email} />
              <input type="hidden" name="displayName" value={values.displayName} />
              <input type="hidden" name="page" value={values.page} />
              {sent ? (
                <>
                  <Heading as="h2">Success! We got your message</Heading>
                  <p>We really appreciate you taking the time to send us this valuable feedback!</p>
                  <p>With love,</p>
                  <Heading as="h4" altStyle>
                    Taylor, Mack, &amp; Tony 😘
                  </Heading>
                  <Button
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                    iconLeft={<FaTimes />}
                    block
                    color="text"
                  >
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <Heading>Got feedback for us?</Heading>
                  <Field
                    as={Input}
                    type="textarea"
                    name="feedback"
                    label="We'd love to hear it. What are your thoughts?"
                    validate={requiredField}
                    required
                    placeholder="Don't hold back, let us know what is on your mind"
                  />
                  <Row>
                    <Column xs={6}>
                      <Button
                        type="button"
                        onClick={() => {
                          setModalIsOpen(false);
                        }}
                        color="dangerOutline"
                        block
                      >
                        Cancel
                      </Button>
                    </Column>
                    <Column xs={6}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        block
                        color="success"
                        iconLeft={<FaCheck />}
                      >
                        Send Feedback
                      </Button>
                    </Column>
                  </Row>
                </>
              )}
            </Form>
          )}
        </Formik>
      </Modal>
    </AppContainer>
  );
};
export default App;
