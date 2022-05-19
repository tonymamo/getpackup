import { TripType } from '@common/trip';
import { Button, Heading, PageContainer, Seo } from '@components';
import { RootState } from '@redux/ducks';
import axios from 'axios';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

type ActionsProps = {};

const Actions: FunctionComponent<ActionsProps> = () => {
  // const firebase = useFirebase();
  // const dispatch = useDispatch();
  const trips: TripType[] = useSelector((state: RootState) => state.firestore.ordered.trips);

  useFirestoreConnect([{ collection: 'trips' }]);

  const updatePackingList = () => {
    if (trips && trips.length > 0 && isLoaded(trips)) {
      trips.forEach((trip, index) => {
        setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log(`calling endpoint for ${trip.tripId}`);
          axios.get(
            process.env.GATSBY_SITE_URL === 'https://getpackup.com'
              ? `https://us-central1-getpackup.cloudfunctions.net/updatePackingList?tripId=${trip.tripId}`
              : `https://us-central1-packup-test-fc0c2.cloudfunctions.net/updatePackingList?tripId=${trip.tripId}`
          );
        }, index * 500);
      });
    }
  };

  return (
    <PageContainer>
      <Seo title="Admin Actions" />

      <Heading>Admin Actions</Heading>

      <Button type="button" onClick={updatePackingList}>
        Run Packing List Update migration
      </Button>
    </PageContainer>
  );
};

export default Actions;
