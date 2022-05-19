import { TripFormType, TripType } from '@common/trip';
import { UserType } from '@common/user';
import {
  Alert,
  Box,
  Column,
  DayPickerInput,
  EditableInput,
  HeroImageUpload,
  HorizontalRule,
  Input,
  PageContainer,
  Pill,
  Row,
  Seo,
  StaticMapImage,
  TripNavigation,
  UserMediaObject,
} from '@components';
import { Link, RouteComponentProps } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { createOptionsFromArrayOfObjects } from '@utils/createOptionsFromArray';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import getSeason from '@utils/getSeason';
import isUserTripOwner from '@utils/isUserTripOwner';
import trackEvent from '@utils/trackEvent';
import { requiredField } from '@utils/validations';
import { endOfDay, startOfDay } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';

type TripDetailsProps = {
  activeTrip?: TripType;
  users: Array<UserType>;
} & RouteComponentProps;

const TripDetails: FunctionComponent<TripDetailsProps> = ({ activeTrip, users }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.firebase.auth);

  useFirestoreConnect([
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const updateTrip = (values: TripFormType) => {
    setIsLoading(true);
    if (activeTrip) {
      const updatedValues = {
        ...values,
        season: getSeason(values.lat, values.lng, values.startDate as string),
        startDate: startOfDay(new Date(values.startDate as string)),
        endDate: endOfDay(new Date(values.endDate as string)),
        updated: new Date(),
        tripLength: values.tripLength,
      };
      firebase
        .firestore()
        .collection('trips')
        .doc(activeTrip.tripId)
        .update({
          ...updatedValues,
        })
        .then(() => {
          trackEvent('Trip Details Updated', {
            ...updatedValues,
          });
          setIsLoading(false);
        })
        .catch((err) => {
          trackEvent('Trip Details Update Failure', {
            ...updatedValues,
          });
          setIsLoading(false);
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  const formattedTripDates =
    activeTrip &&
    (activeTrip.tripLength === 21
      ? formattedDate(new Date(activeTrip.startDate.seconds * 1000))
      : formattedDateRange(activeTrip.startDate.seconds * 1000, activeTrip.endDate.seconds * 1000));

  const onlyActivityTags = activeTrip
    ? activeTrip.tags.filter((item) =>
        gearListActivities.some((activity) => item === activity.label)
      )
    : [];

  const onlyAccommodationOrCampKitchenTags = activeTrip
    ? activeTrip.tags.filter(
        (item) =>
          gearListAccommodations.some((activity) => item === activity.label) ||
          gearListCampKitchen.some((activity) => item === activity.label)
      )
    : [];

  const onlyOtherConsiderationsTags = activeTrip
    ? activeTrip.tags.filter((item) =>
        gearListOtherConsiderations.some((activity) => item === activity.label)
      )
    : [];

  return (
    <>
      <Seo title="Trip Details">
        {typeof google !== 'object' && (
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        )}
      </Seo>
      <PageContainer>
        {typeof activeTrip !== 'undefined' && activeTrip && (
          <>
            <TripNavigation
              activeTrip={activeTrip}
              userIsTripOwner={isUserTripOwner(activeTrip, auth.uid)}
            />
            <HeroImageUpload type="trip" image={activeTrip.headerImage} id={activeTrip.tripId} />
            <Formik
              validateOnMount
              initialValues={
                {
                  ...activeTrip,
                  startDate: new Date(activeTrip.startDate.seconds * 1000),
                  endDate: new Date(activeTrip.endDate.seconds * 1000),
                  activityTags: [...onlyActivityTags],
                  accommodationAndKitchenTags: [...onlyAccommodationOrCampKitchenTags],
                  otherConsiderationTags: [...onlyOtherConsiderationsTags],
                } as TripFormType & {
                  activityTags?: string[];
                  accommodationAndKitchenTags?: string[];
                  otherConsiderationTags?: string[];
                }
              }
              onSubmit={(values, { setSubmitting }) => {
                const valuesToSave = {
                  ...values,
                  tags: [
                    ...(values.activityTags || []),
                    ...(values.accommodationAndKitchenTags || []),
                    ...(values.otherConsiderationTags || []),
                  ],
                };
                delete valuesToSave.activityTags;
                delete valuesToSave.accommodationAndKitchenTags;
                delete valuesToSave.otherConsiderationTags;
                updateTrip(valuesToSave);
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, setFieldTouched, initialValues, ...rest }) => (
                <Form autoComplete="off">
                  <Row>
                    <Column lg={8}>
                      <Box>
                        <EditableInput
                          label="Trip Name"
                          isLoading={isLoading}
                          value={activeTrip.name}
                        >
                          <Field
                            as={Input}
                            type="text"
                            name="name"
                            label="Trip Name"
                            validate={requiredField}
                            required
                            autoComplete="off"
                            hiddenLabel
                          />
                        </EditableInput>
                        <EditableInput
                          label="Trip Date"
                          isLoading={isLoading}
                          value={formattedTripDates as string}
                        >
                          <DayPickerInput
                            hiddenLabel
                            label="Trip Date"
                            initialValues={initialValues}
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                          />
                        </EditableInput>
                        <EditableInput
                          label="Location"
                          isLoading={isLoading}
                          value={
                            !!activeTrip.lat && !!activeTrip.lng ? (
                              <StaticMapImage
                                lat={activeTrip.lat}
                                lng={activeTrip.lng}
                                height={200}
                                width="100%"
                                zoom={13}
                                label={activeTrip.startingPoint}
                              />
                            ) : (
                              activeTrip.startingPoint
                            )
                          }
                        >
                          {typeof window !== 'undefined' && window.google ? (
                            <Field
                              as={Input}
                              type="geosuggest"
                              types={[]}
                              name="startingPoint"
                              label="Starting Location"
                              validate={requiredField}
                              required
                              hiddenLabel
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              {...rest}
                            />
                          ) : (
                            <Alert
                              type="info"
                              message="Failed to load Google Maps, please refresh the page to try again"
                            />
                          )}
                        </EditableInput>
                        <EditableInput
                          label="Description"
                          isLoading={isLoading}
                          value={activeTrip.description || 'No description provided'}
                        >
                          <Field
                            as={Input}
                            type="textarea"
                            name="description"
                            label="Description"
                            hiddenLabel
                          />
                        </EditableInput>
                        <EditableInput
                          label="Activities"
                          isLoading={isLoading}
                          value={
                            onlyActivityTags && onlyActivityTags.length > 0 ? (
                              <>
                                {onlyActivityTags.map((tag: string) => (
                                  <Pill key={`${tag}tag`} text={tag} color="neutral" />
                                ))}
                              </>
                            ) : (
                              'No activities selected'
                            )
                          }
                        >
                          <Field
                            as={Input}
                            type="select"
                            isMulti
                            name="activityTags"
                            label="Activity Tags"
                            hiddenLabel
                            options={createOptionsFromArrayOfObjects(gearListActivities, 'label')}
                            required
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            {...rest}
                          />
                        </EditableInput>
                        <EditableInput
                          label="Accommodations/Kitchen"
                          isLoading={isLoading}
                          value={
                            onlyAccommodationOrCampKitchenTags &&
                            onlyAccommodationOrCampKitchenTags.length > 0 ? (
                              <>
                                {onlyAccommodationOrCampKitchenTags.map((tag: string) => (
                                  <Pill key={`${tag}tag`} text={tag} color="neutral" />
                                ))}
                              </>
                            ) : (
                              'No accommodations or kitchen setups selected'
                            )
                          }
                        >
                          <Field
                            as={Input}
                            type="select"
                            isMulti
                            name="accommodationAndKitchenTags"
                            label="Accommodation & Kictchen Tags"
                            hiddenLabel
                            options={createOptionsFromArrayOfObjects(
                              [...gearListAccommodations, ...gearListCampKitchen],
                              'label'
                            )}
                            required
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            {...rest}
                          />
                        </EditableInput>
                        <EditableInput
                          label="Other Considerations"
                          isLoading={isLoading}
                          value={
                            onlyOtherConsiderationsTags &&
                            onlyOtherConsiderationsTags.length > 0 ? (
                              <>
                                {onlyOtherConsiderationsTags.map((tag: string) => (
                                  <Pill key={`${tag}tag`} text={tag} color="neutral" />
                                ))}
                              </>
                            ) : (
                              'No other considerations selected'
                            )
                          }
                        >
                          <Field
                            as={Input}
                            type="select"
                            isMulti
                            name="otherConsiderationTags"
                            label="Other Consideration Tags"
                            hiddenLabel
                            options={createOptionsFromArrayOfObjects(
                              gearListOtherConsiderations,
                              'label'
                            )}
                            required
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            {...rest}
                          />
                        </EditableInput>
                      </Box>
                    </Column>
                    <Column lg={4}>
                      <Box>
                        <p>
                          <strong>Created</strong>
                        </p>
                        <p>
                          {activeTrip.created?.toDate().toLocaleDateString()}{' '}
                          {activeTrip.created?.toDate().toLocaleTimeString()}
                        </p>
                        <HorizontalRule compact />
                        {activeTrip.updated && (
                          <>
                            <p>
                              <strong>Last Updated</strong>
                            </p>
                            <p>
                              {activeTrip.updated?.toDate().toLocaleDateString()}{' '}
                              {activeTrip.updated?.toDate().toLocaleTimeString()}
                            </p>
                            <HorizontalRule compact />
                          </>
                        )}
                        <p>
                          <strong>Party Members</strong>{' '}
                          <small>
                            <Link to={`/app/trips/${activeTrip.tripId}/party`}>Edit &rarr;</Link>
                          </small>
                        </p>

                        {users &&
                          Object.values(activeTrip.tripMembers).map((tripMember: any) => {
                            const matchingUser: UserType | undefined = users[tripMember.uid]
                              ? users[tripMember.uid]
                              : undefined;
                            if (!matchingUser) return null;
                            return (
                              <Fragment key={matchingUser.uid}>
                                <UserMediaObject user={matchingUser} showSecondaryContent />
                                <br />
                              </Fragment>
                            );
                          })}
                      </Box>
                    </Column>
                  </Row>
                </Form>
              )}
            </Formik>
          </>
        )}
      </PageContainer>
    </>
  );
};

export default TripDetails;
