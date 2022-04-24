import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import axios from 'axios';
import { IncomingWebhook } from '@slack/webhook';

import { Seo, Button, Heading, PageContainer } from '@components';
import { RootState } from '@redux/ducks';
import { TripType } from '@common/trip';

type ActionsProps = {};

const Actions: FunctionComponent<ActionsProps> = () => {
  // const firebase = useFirebase();
  // const dispatch = useDispatch();
  const trips: TripType[] = useSelector((state: RootState) => state.firestore.ordered.trips);

  const webhook = new IncomingWebhook(process.env.GATSBY_SLACK_WEBHOOK_URL as string);

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
      <Button
        type="button"
        onClick={() => webhook.send(`testing out slack webhooks from client app`)}
        // axios({
        //   method: 'post',
        //   url:
        //     'https://hooks.slack.com/services/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',
        //   data: {
        //     text: `testing out slack webhooks from client app`,
        //   },
        //   headers: {
        //     'Content-type': 'application/json',
        //     '': 'xoxb-1245549476631-3417701667927-7pw6NE2nLWsnWKg4ksmnLuR9',
        //   },
        // })
        // }
      >
        send to slack
      </Button>
    </PageContainer>
  );
};

export default Actions;
