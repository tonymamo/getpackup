import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { Heading, PageContainer, Box, Button, Seo } from '../components';
import { RootState } from '../redux/ducks';
import { TripType } from './Trips';
import { dateWithTimezoneOffset, formattedDateForDateInput } from '../utils/dateUtils';
import TripSummaryForm from './TripSummaryForm';

type EditTripSummaryProps = {
  id?: string;
} & RouteComponentProps;

const EditTripSummary: FunctionComponent<EditTripSummaryProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const activeTrip = trips && trips.find((trip) => trip.id === props.id);
  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);

  const initialValues = activeTrip
    ? {
        ...activeTrip,
        startDate: formattedDateForDateInput(
          dateWithTimezoneOffset(activeTrip.startDate.seconds * 1000, activeTrip.timezoneOffset)
        ),
        endDate: formattedDateForDateInput(
          dateWithTimezoneOffset(activeTrip.endDate.seconds * 1000, activeTrip.timezoneOffset)
        ),
      }
    : {
        name: '',
        description: '',
        startingPoint: '',
        startDate: '',
        endDate: '',
        owner: auth.uid,
      };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="New Trip" />
      <p>
        <Button type="link" to={`/app/trips/${props.id}`} iconLeft={<FaChevronCircleLeft />}>
          Back to Trip Summary
        </Button>
      </p>
      <Box>
        {activeTrip && (
          <>
            <Heading altStyle as="h2">
              Edit Trip
            </Heading>
            <TripSummaryForm initialValues={initialValues} type="edit" />
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default EditTripSummary;
