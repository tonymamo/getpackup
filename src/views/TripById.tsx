import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaMapMarkerAlt, FaCalendar, FaPencilAlt } from 'react-icons/fa';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Link } from 'gatsby';

import { Heading, Box, Seo, FlexContainer } from '../components';
import { RootState } from '../redux/ducks';
import { TripType } from './Trips';
import { formattedDateRange, isBeforeToday } from '../utils/dateUtils';

type TripByIdProps = {
  user?: firebase.User;
  id?: string;
} & RouteComponentProps;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', props.user?.uid] }]);

  const activeTrip = trips && trips.find((trip) => trip.id === props.id);
  return (
    <>
      <Seo title={activeTrip?.name || 'My Trip'} />

      {activeTrip ? (
        <div>
          <Box key={activeTrip.tripId}>
            <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
              <Heading as="h3" altStyle>
                {activeTrip.name}
              </Heading>
              {!isBeforeToday(activeTrip.endDate.seconds * 1000, activeTrip.timezoneOffset) && (
                <div>
                  <Link to={`/app/trips/${activeTrip.id}/edit`}>
                    <FaPencilAlt /> Edit
                  </Link>
                </div>
              )}
            </FlexContainer>

            <p>{activeTrip.description}</p>
            <p>
              <FaMapMarkerAlt /> {activeTrip.startingPoint}
            </p>
            <p>
              <FaCalendar />{' '}
              {formattedDateRange(
                activeTrip.startDate.seconds * 1000,
                activeTrip.endDate.seconds * 1000,
                activeTrip.timezoneOffset
              )}
            </p>
          </Box>
        </div>
      ) : (
        <p>No trip found</p>
      )}
    </>
  );
};

export default TripById;
