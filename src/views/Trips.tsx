import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaPlusCircle } from 'react-icons/fa';

import { Heading, PageContainer, Box, Button, Seo, HorizontalRule } from '../components';

type TripsProps = {} & RouteComponentProps;

const Trips: FunctionComponent<TripsProps> = () => {
  return (
    <PageContainer withVerticalPadding>
      <Seo title="Trips" />
      <Box>
        <Heading>My Trips</Heading>
        <Button type="link" to="/trips/new" iconLeft={<FaPlusCircle />}>
          new trip
        </Button>
        <HorizontalRule />
        <Heading as="h2">Upcoming</Heading>
        <p>No upcoming trips</p>
        <HorizontalRule />
        <Heading as="h2">Past</Heading>
        <p>No past trips... Time to get out there!</p>
      </Box>
    </PageContainer>
  );
};

export default Trips;
