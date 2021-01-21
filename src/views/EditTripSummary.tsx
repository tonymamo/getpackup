import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import { Heading, Seo, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import TripSummaryForm from '@views/TripSummaryForm';
import { TripType } from '@common/trip';

type EditTripSummaryProps = {
  id?: string;
} & RouteComponentProps;

const EditTripSummary: FunctionComponent<EditTripSummaryProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const activeTrip = trips && trips.find((trip) => trip.id === props.id);
  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', auth.uid] }]);

  // TODO: initialize trip members

  return (
    <>
      <Seo title="Edit Trip" />
      <PageContainer>
        {typeof activeTrip !== 'undefined' && (
          <>
            <Heading altStyle as="h2">
              Edit Trip
            </Heading>
            <TripSummaryForm
              initialValues={{
                ...activeTrip,
                startDate: new Date(activeTrip.startDate.seconds * 1000),
                endDate: new Date(activeTrip.endDate.seconds * 1000),
              }}
              type="edit"
            />
          </>
        )}
      </PageContainer>
    </>
  );
};

export default EditTripSummary;
