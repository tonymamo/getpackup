import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { Heading, Seo, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import { formattedDateForDateInput } from '@utils/dateUtils';
import { TripType } from '@views/Trips';
import TripSummaryForm from '@views/TripSummaryForm';

type EditTripSummaryProps = {
  id?: string;
} & RouteComponentProps;

const EditTripSummary: FunctionComponent<EditTripSummaryProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const activeTrip = trips && trips.find((trip) => trip.id === props.id);
  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);
  useFirestoreConnect([{ collection: 'users', where: ['owner', '==', auth.uid] }]);

  const initialValues = activeTrip
    ? {
        ...activeTrip,
        startDate: formattedDateForDateInput(new Date(activeTrip.startDate.seconds * 1000)),
        endDate: formattedDateForDateInput(new Date(activeTrip.endDate.seconds * 1000)),
      }
    : {
        name: '',
        description: '',
        startingPoint: '',
        startDate: '',
        endDate: '',
        owner: auth.uid,
        tripMembers: [],
        tripLength: 1,
      };

  // TODO: initialize trip members

  return (
    <>
      <Seo title="Edit Trip" />
      <PageContainer>
        {activeTrip && (
          <>
            <Heading altStyle as="h2">
              Edit Trip
            </Heading>
            <TripSummaryForm initialValues={initialValues} type="edit" />
          </>
        )}
      </PageContainer>
    </>
  );
};

export default EditTripSummary;
