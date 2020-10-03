import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { Heading, PageContainer, Box, Button, Seo } from '../components';
import { RootState } from '../redux/ducks';
import TripSummaryForm from './TripSummaryForm';

type NewTripSummaryProps = {} & RouteComponentProps;

const NewTripSummary: FunctionComponent<NewTripSummaryProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const initialValues = {
    name: '',
    description: '',
    startingPoint: '',
    startDate: '',
    endDate: '',
    owner: auth.uid,
  };

  const error = () => {
    throw new Error('help');
  };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="New Trip" />
      <p>
        <Button type="link" to="/app/trips" iconLeft={<FaChevronCircleLeft />}>
          Back to all trips
        </Button>
        <Button type="button" onClick={() => error()}>
          Back to all trips
        </Button>
      </p>
      <Box>
        <Heading altStyle as="h2">
          Create New Trip
        </Heading>
        <TripSummaryForm initialValues={initialValues} type="new" />
      </Box>
    </PageContainer>
  );
};

export default NewTripSummary;
