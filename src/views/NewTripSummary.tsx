import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';

import { Heading, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import TripSummaryForm from '@views/TripSummaryForm';

type NewTripSummaryProps = {} & RouteComponentProps;

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const initialValues = {
    owner: auth.uid,
    tripId: '',
    name: '',
    description: '',
    startingPoint: '',
    startDate: undefined,
    endDate: undefined,
    timezoneOffset: new Date().getTimezoneOffset(),
    tripMembers: [],
    tags: [],
    tripLength: 1,
    season: undefined,
    lat: 0,
    lng: 0,
  };

  return (
    <PageContainer>
      <Heading altStyle as="h2">
        Create New Trip
      </Heading>
      <TripSummaryForm initialValues={initialValues} />
    </PageContainer>
  );
};

export default NewTripSummary;
