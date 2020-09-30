import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaMapMarkerAlt, FaCalendar, FaPlusCircle } from 'react-icons/fa';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import { Heading, PageContainer, Box, Button, Seo } from '../components';
import { RootState } from '../redux/ducks';

type TripsProps = {
  user: firebase.User;
} & RouteComponentProps;

export type Trip = {
  id: string;
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  startDate: Date;
  endDate: Date;
};

const Trips: FunctionComponent<TripsProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<Trip> = useSelector((state: RootState) => state.firestore.ordered.trips);

  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);

  return (
    <PageContainer withVerticalPadding>
      <Seo title="My Trips" />

      <p>
        <Button type="link" to="/app/trips/new" iconLeft={<FaPlusCircle />} block>
          new trip
        </Button>
      </p>

      <Heading as="h2">Upcoming</Heading>
      {trips && trips.length > 0 ? (
        <div>
          {trips.map((trip) => (
            <Box key={trip.tripId}>
              <Heading as="h3">{trip.name}</Heading>
              <p>{trip.description}</p>
              <p>
                <FaMapMarkerAlt /> {trip.startingPoint}
              </p>
              <p>
                <FaCalendar /> {trip.startDate}&mdash;{trip.endDate}
              </p>
            </Box>
          ))}
        </div>
      ) : (
        <p>No upcoming trips</p>
      )}

      <Heading as="h2">Past</Heading>
      <p>No past trips... Time to get out there!</p>
    </PageContainer>
  );
};

export default Trips;
