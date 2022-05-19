import { RouteComponentProps } from '@reach/router';
import React, { FunctionComponent, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import { startOfDay, endOfDay } from 'date-fns';

import {
  Input,
  Button,
  HorizontalRule,
  Seo,
  FormErrors,
  DayPickerInput,
  FlexContainer,
  Heading,
  PageContainer,
  UserSearch,
  Box,
  UserMediaObject,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import { TripFormType, TripMemberStatus } from '@common/trip';
import getSeason from '@utils/getSeason';
import trackEvent from '@utils/trackEvent';
import { RootState } from '@redux/ducks';
import axios from 'axios';
import { MAX_TRIP_PARTY_SIZE } from '@common/constants';
import { StyledLabel } from '@components/Input';
import { UserType } from '@common/user';
import sendTripInvitationEmail from '@utils/sendTripInvitationEmail';

type MembersToInviteType = { uid: string; email: string }[];

type NewTripSummaryProps = {} & RouteComponentProps;

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const users = useSelector((state: RootState) => state.firestore.data.users);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isSearchBarDisabled, setIsSearchBarDisabled] = useState(false);
  const [membersToInvite, setMembersToInvite] = useState<MembersToInviteType>([]);

  useFirestoreConnect([
    {
      collection: 'users',
      where: [
        'uid',
        'in',
        membersToInvite && membersToInvite.length > 0
          ? membersToInvite.map((m) => m.uid)
          : [auth.uid],
      ],
    },
  ]);

  const updateTripMembers = (uid: string, email: string) => {
    // Object.values(acceptedTripMembersOnly(activeTrip)).length + 1 accounts for async data updates
    if (membersToInvite && membersToInvite.length + 1 > MAX_TRIP_PARTY_SIZE) {
      setIsSearchBarDisabled(true);
      // send us a slack message so we can follow up
      axios.get(
        process.env.GATSBY_SITE_URL === 'https://getpackup.com'
          ? `https://us-central1-getpackup.cloudfunctions.net/notifyOnTripPartyMaxReached?tripId=new`
          : `https://us-central1-packup-test-fc0c2.cloudfunctions.net/notifyOnTripPartyMaxReached?tripId=new`
      );
      dispatch(
        addAlert({
          type: 'danger',
          message: `At this time, Trip Parties are limited to ${MAX_TRIP_PARTY_SIZE} people.`,
        })
      );
      return;
    }

    setMembersToInvite((prevState) => [...prevState, { uid, email }]);
  };

  const addNewTrip = (values: TripFormType) => {
    setIsLoading(true);
    setIsSearchBarDisabled(true);
    const tripMembers: Record<string, any> = {};
    tripMembers[`${auth.uid}`] = {
      uid: auth.uid,
      status: TripMemberStatus.Owner,
      invitedAt: new Date(),
      acceptedAt: firebase.firestore.Timestamp.serverTimestamp,
    };

    membersToInvite.forEach((member) => {
      tripMembers[`${member.uid}`] = {
        uid: member.uid,
        status: TripMemberStatus.Pending,
        invitedAt: new Date(),
        invitedBy: auth.uid,
      };
    });

    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate as string)),
        endDate: endOfDay(new Date(values.endDate as string)),
        tags: [],
        created: new Date(),
        tripMembers,
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
        });
        membersToInvite.forEach((member) => {
          sendTripInvitationEmail({
            tripId: docRef.id,
            invitedBy: profile.username,
            email: member.email,
          });
        });
        trackEvent('New Trip Submit Successful', { values: { ...values } });
        navigate(`/app/trips/${docRef.id}/add-trip-image`);
      })
      .catch((err) => {
        trackEvent('New Trip Submit Unsuccessful', { values: { ...values }, error: err });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const initialValues: TripFormType = {
    owner: auth.uid,
    tripId: '',
    name: '',
    description: '',
    startingPoint: '',
    startDate: undefined,
    endDate: undefined,
    timezoneOffset: new Date().getTimezoneOffset(),
    tripLength: 1,
    season: undefined,
    lat: 0,
    lng: 0,
    archived: false,
    tags: [],
    tripMembers: {},
  };

  return (
    <PageContainer>
      <Heading altStyle as="h2">
        Create New Trip
      </Heading>
      <>
        <Seo title="New Trip">
          {typeof google !== 'object' && (
            <script
              type="text/javascript"
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
            />
          )}
        </Seo>
        <Formik
          validateOnMount
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const valuesWithSeason = {
              ...values,
              season: getSeason(values.lat, values.lng, values.startDate as string),
            };
            trackEvent('New Trip Submit Button Clicked', valuesWithSeason);

            addNewTrip(valuesWithSeason);

            setSubmitting(false);
          }}
        >
          {({
            isSubmitting,
            isValid,
            values,
            setFieldValue,
            dirty,
            errors,
            setFieldTouched,
            touched,
            ...rest
          }) => (
            <Form autoComplete="off">
              <Field
                as={Input}
                type="text"
                name="name"
                label="Trip Name"
                validate={requiredField}
                required
                autoComplete="off"
                maxLength={50}
              />

              <DayPickerInput
                label="Trip Date"
                initialValues={initialValues}
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />

              <Field as={Input} type="textarea" name="description" label="Description" />

              <Field
                as={Input}
                type="geosuggest"
                types={[]}
                name="startingPoint"
                label="Trip Location"
                validate={requiredField}
                required
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                {...rest}
              />

              <StyledLabel>Trip Party</StyledLabel>
              <UserSearch
                activeTrip={undefined}
                updateTrip={(uid, email) => {
                  updateTripMembers(uid, email);
                }}
                isSearchBarDisabled={isSearchBarDisabled}
              />

              {membersToInvite.length > 0 ? (
                <Box>
                  {membersToInvite.map((tripMember, index) => {
                    const matchingUser: UserType =
                      users && users[tripMember.uid] ? users[tripMember.uid] : undefined;
                    if (!matchingUser) return null;
                    return (
                      <div key={matchingUser.uid}>
                        <UserMediaObject
                          user={matchingUser}
                          showSecondaryContent
                          action={
                            <Button
                              type="button"
                              color="tertiary"
                              size="small"
                              onClick={() =>
                                setMembersToInvite((prevState) =>
                                  prevState.filter((_, i) => i !== index)
                                )
                              }
                            >
                              Remove
                            </Button>
                          }
                        />
                        {index !== membersToInvite.length - 1 && <HorizontalRule compact />}
                      </div>
                    );
                  })}
                </Box>
              ) : null}

              <HorizontalRule />

              <FormErrors dirty={dirty} errors={errors} />
              <FlexContainer justifyContent="space-between">
                <Button
                  type="link"
                  to="../"
                  color="tertiary"
                  rightSpacer
                  iconLeft={<FaChevronLeft />}
                  onClick={() =>
                    trackEvent('New Trip Form Cancelled', {
                      values: { ...values },
                      errors: { ...errors },
                      touched: { ...touched },
                      dirty,
                      isValid,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || isLoading}
                  isLoading={isLoading}
                  color="success"
                  iconRight={<FaChevronRight />}
                >
                  Continue
                </Button>
              </FlexContainer>
            </Form>
          )}
        </Formik>
      </>
    </PageContainer>
  );
};

export default NewTripSummary;
