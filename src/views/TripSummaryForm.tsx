import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase, useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import DatePicker from 'react-datepicker';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { components } from 'react-select';
import styled from 'styled-components';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

import { Avatar, Input, Button, HorizontalRule, Column, Row, FlexContainer } from '@components';
import { StyledLabel } from '@components/Input';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import { RootState } from '@redux/ducks';
import ReactDatepickerTheme from '@styles/react-datepicker';
import { textColor, textColorLight, white } from '@styles/color';
import { fontSizeSmall } from '@styles/typography';
import { TripMember } from './Trips';

type TripSummaryProps = {
  initialValues: {
    owner: string;
    tripId?: string;
    name: string;
    description: string;
    startingPoint: string;
    startDate: string | Date;
    endDate: string | Date;
    timezoneOffset: number;
    tripMembers: Array<TripMember>;
    tags: Array<string>;
    tripLength: number;
  };
  type: 'new' | 'edit';
};

const SliderWrapper = styled.div`
  & .rangeslider {
    font-size: ${fontSizeSmall};
    box-shadow: none;
    background-color: ${textColorLight};
  }

  & .rangeslider-horizontal .rangeslider__fill {
    background-color: ${textColor};
    box-shadow: none;
  }

  & .rangeslider .rangeslider__handle {
    background: ${textColor};
    border-color: ${textColor};
    box-shadow: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .rangeslider-horizontal .rangeslider__handle:after {
    content: none;
  }

  & .rangeslider .rangeslider__handle-tooltip {
    width: 75px;
  }

  & .rangeslider__handle-label {
    color: ${white};
    text-align: center;
    font-size: ${fontSizeSmall};
  }

  & .rangeslider__labels .rangeslider__label-item {
    font-size: ${fontSizeSmall};
  }
`;

const TripSummaryForm: FunctionComponent<TripSummaryProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users: Array<any> = useSelector((state: RootState) => state.firestore.ordered.users);

  const [isLoading, setIsLoading] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState(new Date(props.initialValues.startDate));

  useFirestoreConnect([{ collection: 'users' }]);

  const formatTripLengthAsString = (value: number) =>
    `${value === 21 ? '20+ Days' : `${value === 1 ? 'Day Trip' : `${value} days`}`}`;

  const addNewTrip = (values: TripSummaryProps['initialValues']) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate)),
        endDate: endOfDay(new Date(values.endDate)),
        tags: [formatTripLengthAsString(values.tripLength)],
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
    setIsLoading(true);
    const existingTagsWithoutTripLengthTag = props.initialValues.tags.filter(
      (tag) => !tag.includes('day')
    );
    firebase
      .firestore()
      .collection('trips')
      .doc(props.initialValues.tripId)
      .set({
        ...values,
        startDate: startOfDay(new Date(values.startDate)),
        endDate: endOfDay(new Date(values.endDate)),
        updated: new Date(),
        tags: [...existingTagsWithoutTripLengthTag, formatTripLengthAsString(values.tripLength)],
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
                <StyledLabel required>Trip Length</StyledLabel>
                <SliderWrapper>
                  <Slider
                    min={1}
                    max={21}
                    step={1}
                    value={values.tripLength ?? 1}
                    tooltip
                    format={(value) => formatTripLengthAsString(value)}
                    handleLabel={values.tripLength === 21 ? '20+' : String(values.tripLength)}
                    labels={{
                      1: 'Day Trip',
                      10: '10 Days',
                      21: '20+',
                    }}
                    onChange={(value) => {
                      setFieldValue('tripLength', value);
                      setFieldValue('endDate', addDays(new Date(values.startDate), value));
                    }}
                  />
                </SliderWrapper>
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
                disabled={isSubmitting || !isValid || isLoading}
                isLoading={isLoading}
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
