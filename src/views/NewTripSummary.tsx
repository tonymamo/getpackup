import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import addDays from 'date-fns/addDays';

import { Heading, Box, Seo } from '@components';
import { RootState } from '@redux/ducks';
import TripSummaryForm from '@views/TripSummaryForm';

type NewTripSummaryProps = {} & RouteComponentProps;

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const initialValues = {
    name: '',
    description: '',
    startingPoint: '',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
    owner: auth.uid,
    tripMembers: [],
  };

  return (
    <>
      <Seo title="New Trip" />
      <Box>
        <Heading altStyle as="h2">
          Create New Trip
        </Heading>
        <TripSummaryForm initialValues={initialValues} type="new" />
      </Box>
    </>
  );
};

export default NewTripSummary;
