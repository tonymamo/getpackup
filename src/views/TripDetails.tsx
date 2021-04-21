import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { Formik, Form, Field } from 'formik';
import { startOfDay, endOfDay } from 'date-fns';

import {
  PageContainer,
  Column,
  Row,
  Input,
  EditableInput,
  DayPickerInput,
  Seo,
  StaticMapImage,
  Pill,
  Alert,
  Box,
  HorizontalRule,
  UserMediaObject,
} from '@components';
import { TripType, TripFormType } from '@common/trip';
import { addAlert } from '@redux/ducks/globalAlerts';
import getSeason from '@utils/getSeason';
import { requiredField } from '@utils/validations';
import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import { createOptionsFromArrayOfObjects } from '@utils/createOptionsFromArray';
import { gearListActivities } from '@utils/gearListItemEnum';
import TripNavigation from '@views/TripNavigation';
import { UserType } from '@common/user';

type TripDetailsProps = {
  activeTrip?: TripType;
  loggedInUser?: UserType;
} & RouteComponentProps;

const TripDetails: FunctionComponent<TripDetailsProps> = ({ activeTrip, loggedInUser }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const updateTrip = (values: TripFormType) => {
    setIsLoading(true);
    if (activeTrip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(activeTrip.tripId)
        .set({
          ...values,
          season: getSeason(values.lat, values.lng, values.startDate as string),
          startDate: startOfDay(new Date(values.startDate as string)),
          endDate: endOfDay(new Date(values.endDate as string)),
          updated: new Date(),
          tripMembers: [...activeTrip.tripMembers, ...values.tripMembers],
          tripLength: values.tripLength,
        })
        .then(() => {
          setIsLoading(false);
          dispatch(
            addAlert({
              type: 'success',
              message: `Successfully updated ${values.name}`,
            })
          );
        })
        .catch((err) => {
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
    (activeTrip?.tripLength === 21
      ? formattedDate(new Date(activeTrip.startDate.seconds * 1000))
      : formattedDateRange(activeTrip.startDate.seconds * 1000, activeTrip.endDate.seconds * 1000));

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
        {typeof activeTrip !== 'undefined' && (
          <>
            <TripNavigation activeTrip={activeTrip} />
            {!!activeTrip.lat && !!activeTrip.lng && (
              <StaticMapImage
                lat={activeTrip.lat}
                lng={activeTrip.lng}
                height={200}
                width="100%"
                zoom={13}
                label={activeTrip.startingPoint}
              />
            )}
            <Formik
              validateOnMount
              initialValues={
                {
                  ...activeTrip,
                  startDate: new Date(activeTrip.startDate.seconds * 1000),
                  endDate: new Date(activeTrip.endDate.seconds * 1000),
                  tripMembers: [],
                } as TripFormType | TripType
              }
              onSubmit={(values, { setSubmitting }) => {
                updateTrip(values as TripFormType);
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, setFieldTouched, initialValues, ...rest }) => (
                <Form autoComplete="off">
                  <Row>
                    <Column lg={8}>
                      <Box>
                        <EditableInput label="Trip Name" isLoading={isLoading} value={values.name}>
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
                          value={values.startingPoint}
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
                          value={values.description || 'No description provided'}
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
                            activeTrip.tags.length > 0 ? (
                              <>
                                {activeTrip.tags.map((tag: string) => (
                                  <Pill key={`${tag}tag`} text={tag} color="primary" />
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
                            name="tags"
                            label="Tags"
                            hiddenLabel
                            options={createOptionsFromArrayOfObjects(gearListActivities, 'label')}
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
                        <p>
                          <strong>Last Updated</strong>
                        </p>
                        <p>
                          {activeTrip.updated?.toDate().toLocaleDateString()}{' '}
                          {activeTrip.updated?.toDate().toLocaleTimeString()}
                        </p>
                        <HorizontalRule compact />
                        {loggedInUser && (
                          <>
                            <p>
                              <strong>Owner</strong>
                            </p>
                            <UserMediaObject user={loggedInUser} />
                          </>
                        )}
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
