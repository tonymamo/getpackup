import React, { FunctionComponent, useState } from 'react';
import { FaCheckCircle, FaChevronCircleRight } from 'react-icons/fa';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { navigate } from 'gatsby';
import { startOfDay, endOfDay, addDays, format as dateFnsFormat } from 'date-fns';
import { components } from 'react-select';
import styled from 'styled-components';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import {
  Avatar,
  Input,
  Button,
  HorizontalRule,
  Column,
  Row,
  FlexContainer,
  UserMediaObject,
  Seo,
} from '@components';
import { StyledLabel } from '@components/Input';
import { addAlert } from '@redux/ducks/globalAlerts';
import { requiredField } from '@utils/validations';
import { RootState } from '@redux/ducks';
import {
  brandPrimary,
  textColor,
  textColorLight,
  white,
  brandPrimaryRGB,
  brandSecondaryRGB,
  brandSecondary,
} from '@styles/color';
import { fontSizeSmall } from '@styles/typography';
import { TripType } from '@common/trip';
import { baseSpacer, borderRadius, doubleSpacer, halfSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { UserType } from '@common/user';

type ValuesType = Omit<TripType, 'startDate' | 'endDate'> & {
  startDate: Date;
  endDate: Date;
};

type TripSummaryProps = {
  initialValues: ValuesType;
  type: 'new' | 'edit';
};

const DayPickerInputWrapper = styled.div<any>`
  margin-bottom: ${baseSpacer};
  background-color: ${white};
  border: ${baseBorderStyle};
  border-radius: ${borderRadius};
  & .DayPicker {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  & .DayPicker-Day--today {
    color: ${textColor};
    font-weight: 700;
  }
  & .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    position: relative;
    background-color: ${brandPrimary};
    color: ${white};
  }
  &
    .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background-color: rgba(${brandPrimaryRGB}, 0.25);
  }
`;

const SliderWrapper = styled.div`
  margin: 0 ${baseSpacer};
  & .rangeslider {
    font-size: ${fontSizeSmall};
    box-shadow: none;
    background-color: ${textColorLight};
    margin-bottom: ${doubleSpacer};
  }
  & .rangeslider-horizontal .rangeslider__fill {
    background-color: ${brandSecondary};
    box-shadow: none;
  }
  & .rangeslider .rangeslider__handle {
    background: ${brandSecondary};
    border-color: ${brandSecondary};
    box-shadow: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover,
    &:focus,
    &:active {
      box-shadow: 0 0 0 4px rgba(${brandSecondaryRGB}, 0.5);
    }
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

const Option = (option: any) => {
  return (
    <components.Option {...option}>
      <FlexContainer justifyContent="flex-start">
        <Avatar src={option.data.photoURL} gravatarEmail={option.data.email} rightMargin />
        <div>
          <div>{option.data.username}</div>
          <small
            style={{
              color: textColorLight,
            }}
          >
            {option.data.label}
          </small>
        </div>
      </FlexContainer>
    </components.Option>
  );
};

const MultiValueLabel = ({
  data,
  ...option
}: {
  data: {
    photoURL: string;
    email: string;
    username: string;
  };
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

const TripSummaryForm: FunctionComponent<TripSummaryProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const users = useSelector((state: RootState) => state.firestore.data.users);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  const [isLoading, setIsLoading] = useState(false);

  useFirestoreConnect([{ collection: 'users' }]);

  const formatTripLengthAsString = (value: number) =>
    `${value === 21 ? '20+ Days' : `${value === 1 ? 'Day Trip' : `${value} Days`}`}`;

  const addNewTrip = (values: ValuesType) => {
    setIsLoading(true);
    firebase
      .firestore()
      .collection('trips')
      .add({
        ...values,
        startDate: startOfDay(new Date(values.startDate)),
        endDate: endOfDay(new Date(values.endDate)),
        tags: [formatTripLengthAsString(values.tripLength)],
        created: new Date(),
      })
      .then((docRef) => {
        docRef.update({
          tripId: docRef.id,
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

  const updateTrip = (values: ValuesType) => {
    setIsLoading(true);
    const existingTagsWithoutTripLengthTag = props.initialValues.tags.filter(
      (tag) => !tag.includes('Day') // case is important here
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
        tripMembers: [...props.initialValues.tripMembers, ...values.tripMembers],
        tags: [...existingTagsWithoutTripLengthTag, formatTripLengthAsString(values.tripLength)],
        tripLength: values.tripLength,
      })
      .then(() => {
        navigate(`/app/trips/${props.initialValues.tripId}`);
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

  type UserOptionsType = Array<
    UserType & {
      value: string;
      label: string;
    }
  >;

  const loadUsers = async (inputValue: string) => {
    const searchValue = inputValue.toLowerCase();
    const usersOptions: UserOptionsType = [];

    const response = await firebase
      .firestore()
      .collection('users')
      .orderBy(`searchableIndex.${searchValue}`)
      // .where('searchableIndex', '>=', searchValue) // document field is greater than search string
      // .where('displayName', '<=', `${searchValue}\uf8ff`) // https://stackoverflow.com/a/56815787/6095128
      .limit(5)
      .get();

    if (!response.empty) {
      response.forEach((doc) => {
        const user = doc.data() as UserType;
        return usersOptions.push({
          ...user,
          value: user.uid,
          label: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          username: user.username,
        });
      });
    }

    // remove yourself from results just in case
    // TODO: also remove existing trip members from results
    return usersOptions.filter(
      (u) => u.uid !== auth.uid && !props.initialValues.tripMembers.includes(u.uid)
    );
  };

  const dateFormat = 'MM/dd/yyyy';

  return (
    <>
      <Seo title={props.type === 'new' ? 'New Trip' : 'Edit Trip'}>
        {typeof google !== 'object' && (
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        )}
      </Seo>
      <Formik
        validateOnMount
        initialValues={{
          ...props.initialValues,
          tripMembers: [],
        }}
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
        {({ isSubmitting, isValid, values, setFieldValue, dirty, ...rest }) => (
          <Form autoComplete="off">
            <Field
              as={Input}
              type="text"
              name="name"
              label="Trip Name"
              validate={requiredField}
              required
              autoComplete="off"
            />
            <Row>
              <Column md={6}>
                <StyledLabel required>Start Date</StyledLabel>
                <DayPickerInputWrapper>
                  <DayPicker
                    month={new Date(values.startDate)}
                    selectedDays={new Date(values.startDate)}
                    onDayClick={(day: Date) => {
                      setFieldValue('startDate', dateFnsFormat(new Date(day), dateFormat));
                      setFieldValue(
                        'endDate',
                        dateFnsFormat(addDays(new Date(day), values.tripLength), dateFormat)
                      );
                    }}
                  />
                </DayPickerInputWrapper>
              </Column>
              <Column md={6}>
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
                      setFieldValue(
                        'endDate',
                        dateFnsFormat(
                          addDays(new Date(values.startDate), value === 1 ? 0 : value),
                          dateFormat
                        )
                      );
                    }}
                  />
                </SliderWrapper>
              </Column>
            </Row>
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

            {props.type === 'edit' && props.initialValues.tripMembers.length > 0 && (
              <>
                <StyledLabel>Trip Party</StyledLabel>
                <div
                  style={{
                    margin: `${halfSpacer} 0 ${baseSpacer}`,
                  }}
                >
                  {props.initialValues.tripMembers.map((tripMember) => {
                    const matchingUser: UserType =
                      users && users[tripMember] ? users[tripMember] : undefined;
                    if (!matchingUser) return null;
                    return (
                      <div key={matchingUser.uid}>
                        <UserMediaObject user={matchingUser} />
                        <HorizontalRule compact />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {profile.isAdmin ? (
              <Field
                as={Input}
                type="async-select"
                placeholder="Search by username"
                // TODO: change to only be users you are following
                // defaultOptions={false}
                loadOptions={loadUsers}
                name="tripMembers"
                label={props.type === 'edit' ? 'Add Trip Members' : 'Trip Members'}
                setFieldValue={setFieldValue}
                isMulti
                value={values.tripMembers}
                components={{
                  Option,
                  MultiValueLabel,
                }}
                {...rest}
              />
            ) : null}

            <HorizontalRule />

            <Button
              type="submit"
              rightSpacer
              disabled={isSubmitting || !isValid || isLoading || !dirty}
              isLoading={isLoading}
              iconLeft={props.type === 'new' ? <FaChevronCircleRight /> : <FaCheckCircle />}
            >
              {props.type === 'new' ? 'Select Activites' : 'Update Trip'}
            </Button>

            <Button type="link" to="../" color="text">
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TripSummaryForm;
