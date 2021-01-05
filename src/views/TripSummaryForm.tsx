import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase, useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import DatePicker from 'react-datepicker';
import { startOfDay, endOfDay } from 'date-fns';
import { components } from 'react-select';

import { Avatar, Input, Button, HorizontalRule, Column, Row, FlexContainer } from '@components';
import { StyledLabel } from '@components/Input';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import { RootState } from '@redux/ducks';
import ReactDatepickerTheme from '@styles/react-datepicker';
import { textColorLight } from '@styles/color';

type TripSummaryProps = {
  initialValues: {
    name: string;
    description: string;
    startingPoint: string;
    startDate: string | Date;
    endDate: string | Date;
    owner: string;
    tripId?: string;
    tripMembers?: Array<string>;
  };
  type: 'new' | 'edit';
};

const TripSummaryForm: FunctionComponent<TripSummaryProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users: Array<any> = useSelector((state: RootState) => state.firestore.ordered.users);

  useFirestoreConnect([{ collection: 'users' }]);

  const addNewTrip = (values: TripSummaryProps['initialValues']) => {
    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate)),
        endDate: endOfDay(new Date(values.endDate)),
        timezoneOffset: new Date().getTimezoneOffset(),
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
          created: new Date(),
        });
        navigate(`/app/trips/${docRef.id}/generator`);
        dispatch(
          addAlert({
            type: 'success',
            message: 'Successfully created new trip',
          })
        );
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const updateTrip = (values: TripSummaryProps['initialValues']) => {
    firebase
      .firestore()
      .collection('trips')
      .doc(props.initialValues.tripId)
      .set({
        ...values,
        startDate: startOfDay(new Date(values.startDate)),
        endDate: endOfDay(new Date(values.endDate)),
        updated: new Date(),
      })
      .then(() => {
        navigate('/app/trips');
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully updated ${values.name}`,
          })
        );
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const [dateRangeStart, setDateRangeStart] = useState(new Date(props.initialValues.startDate));
  const [dateRangeEnd, setDateRangeEnd] = useState(new Date(props.initialValues.endDate));

  const loadUsers = async (inputValue: string) => {
    const searchValue = inputValue.toLowerCase();
    const response = await firebase
      .firestore()
      .collection('users')
      .orderBy(`searchableIndex.${searchValue}`)
      // .where('searchableIndex', '>=', searchValue) // document field is greater than search string
      // .where('displayName', '<=', `${searchValue}\uf8ff`) // https://stackoverflow.com/a/56815787/6095128
      .limit(5)
      .get();
    const usersOptions: Array<any> = [];
    if (!response.empty) {
      response.forEach((doc) => usersOptions.push(doc.data()));
    }

    return usersOptions
      .filter((u) => u.uid !== auth.uid) // remove yourself from results
      .map((user) => {
        return {
          value: user.uid,
          label: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          username: user.username,
        };
      });
  };

  const Option = ({
    children,
    data,
    ...option
  }: {
    children: string;
    data: { photoURL: string; email: string; username: string };
  }) => {
    return (
      <components.Option {...option}>
        <FlexContainer justifyContent="flex-start">
          <Avatar src={data.photoURL} gravatarEmail={data.email} rightMargin />
          <div>
            <div>{data.username}</div>
            <small style={{ color: textColorLight }}>{children}</small>
          </div>
        </FlexContainer>
      </components.Option>
    );
  };

  const MultiValueLabel = ({
    data,
    ...option
  }: {
    data: { photoURL: string; email: string; username: string };
  }) => {
    return (
      <components.MultiValueLabel {...option}>
        <FlexContainer justifyContent="flex-start">
          <Avatar src={data.photoURL} gravatarEmail={data.email} rightMargin size="xs" />
          <div>
            <div>{data.username}</div>
          </div>
        </FlexContainer>
      </components.MultiValueLabel>
    );
  };

  return (
    <>
      <ReactDatepickerTheme />
      <Formik
        validateOnMount
        initialValues={props.initialValues}
        onSubmit={(values, { setSubmitting }) => {
          if (props.type === 'new') {
            addNewTrip(values);
          }
          if (props.type === 'edit') {
            updateTrip(values);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, values, setFieldValue, ...rest }) => (
          <Form>
            <Field
              as={Input}
              type="text"
              name="name"
              label="Trip Name"
              validate={requiredField}
              required
            />
            <Field
              as={Input}
              type="textarea"
              name="description"
              label="Description"
              validate={requiredField}
              required
            />
            {typeof window !== 'undefined' && window.google && (
              <Field
                as={Input}
                type="geosuggest"
                types={[]}
                name="startingPoint"
                label="Starting Location"
                validate={requiredField}
                required
                setFieldValue={setFieldValue}
                {...rest}
              />
            )}

            <Row>
              <Column sm={6}>
                <StyledLabel required>Start Date</StyledLabel>
                <DatePicker
                  selected={dateRangeStart}
                  onChange={(date: Date) => {
                    setFieldValue('startDate', date);
                    setDateRangeStart(date);
                  }}
                  minDate={new Date()}
                />
              </Column>
              <Column sm={6}>
                <StyledLabel required>End Date</StyledLabel>
                <DatePicker
                  selected={dateRangeEnd}
                  onChange={(date: Date) => {
                    setFieldValue('endDate', date);
                    setDateRangeEnd(date);
                  }}
                  minDate={new Date(values.startDate)}
                />
              </Column>
            </Row>
            {users && isLoaded(users) && !isEmpty(users) && users.length > 0 && (
              <Field
                as={Input}
                type="async-select"
                loadOptions={loadUsers}
                name="tripMembers"
                label="Trip Members"
                setFieldValue={setFieldValue}
                isMulti
                components={{ Option, MultiValueLabel }}
                {...rest}
              />
            )}

            <HorizontalRule />
            <p>
              <Button
                type="submit"
                rightSpacer
                disabled={isSubmitting || !isValid}
                iconLeft={props.type === 'new' ? <FaChevronCircleRight /> : <FaCheckCircle />}
              >
                {props.type === 'new' ? 'Select Activites' : 'Update Trip'}
              </Button>
              {props.type === 'new' && (
                <Button type="link" to="/app/trips" color="dangerOutline">
                  Cancel
                </Button>
              )}
            </p>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TripSummaryForm;
