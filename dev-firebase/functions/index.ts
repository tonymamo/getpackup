import { BigBatch } from '@qualdesk/firestore-big-batch';
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const chunk = require('lodash/chunk');

admin.initializeApp();

exports.copyOwnerToTripMembers = functions.https.onRequest(async (_, res) => {
  const snapshot = await admin.firestore().collection('trips').get();
  const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

  /**
   * `chunk` function splits the array into chunks up to the provided length.
   * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
   */
  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises: any[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const batch of batches) {
    batch.forEach((doc: any) => {
      if (!doc.get('tripMembers') || !doc.get('owner')) {
        return;
      }
      const writeBatch = admin.firestore().batch();
      //   console.log(doc.get('tripMembers'));
      const ownerAlreadyAMember =
        doc.get('tripMembers').length > 0
          ? doc.get('tripMembers').some((member: any) => member === doc.get('owner'))
          : false;
      if (!ownerAlreadyAMember && doc.get('owner')) {
        // console.log([...doc.get('tripMembers'), doc.get('owner')]);
        writeBatch.update(doc.ref, { tripMembers: [doc.get('owner')] });
        commitBatchPromises.push(writeBatch.commit());
      }
    });
  }
  res.send(`Updated tripMembers for ${commitBatchPromises.length} trips`);
  await Promise.all(commitBatchPromises);
});

exports.convertTripMembersToInviteObject = functions.https.onRequest(async (_, res) => {
  const snapshot = await admin.firestore().collection('trips').get();
  const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

  /**
   * `chunk` function splits the array into chunks up to the provided length.
   * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
   */
  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises: any[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const batch of batches) {
    batch.forEach((doc: any) => {
      if (!doc.get('tripMembers') || !doc.get('owner')) {
        return;
      }
      const writeBatch = admin.firestore().batch();

      // eslint-disable-next-line no-restricted-syntax
      //  for (const member of doc.get('tripMembers')) {
      writeBatch.update(doc.ref, {
        tripMembers: {
          [doc.get('owner')]: {
            invitedAt: doc.get('created'),
            acceptedAt: doc.get('created'),
            status: 'Owner',
            uid: doc.get('owner'),
          },
        },
      });
      // }

      commitBatchPromises.push(writeBatch.commit());
    });
  }
  res.send(`Updated tripMembers for ${commitBatchPromises.length} trips`);
  await Promise.all(commitBatchPromises);
});

exports.updatePackingList = functions.https.onRequest(async (req, res) => {
  const tripId = req.query.lastKey;

  const snapshots = await admin
    .firestore()
    .collection('trips')
    .doc(tripId as string)
    .get();

  const commitBatchPromises: any[] = [];

  const packingListItemsSnapshot = await snapshots.ref.collection('packing-list').get();

  packingListItemsSnapshot.docs.forEach(async (item) => {
    const listBatch = new BigBatch({ firestore: admin.firestore() });

    listBatch.update(item.ref, {
      packedBy: [
        {
          uid: (await snapshots.ref.get()).data()?.owner || '',
          quantity: item.get('quantity') ?? 1,
          isShared: false,
        },
      ],
    });
    commitBatchPromises.push(listBatch.commit());
  });

  try {
    const finished = await Promise.all(commitBatchPromises);
    if (finished) {
      res.send('completed');
    }
  } catch (err) {
    res.send('error');
  }
});

exports.addOwnerToPackingListItems = functions.https.onRequest(async () => {
  const snapshot = await admin.firestore().collection('trips').limit(10).get();

  snapshot.docs.forEach(async (doc) => {
    const packingList = await admin
      .firestore()
      .collection('trips')
      .doc(doc.id)
      .collection('packing-list')
      .get();

    await packingList.docs.forEach(async (item) => {
      const batch = new BigBatch({ firestore: admin.firestore() });
      const packedByExists = (await item.ref.get()).data()?.packedBy;

      if (!packedByExists || packedByExists.length === 0) {
        await batch.update(item.ref, {
          packedBy: [
            {
              uid: (await doc.ref.get()).data()?.owner || '',
              quantity: 1,
              isShared: false,
            },
          ],
        });
      }
      await batch.commit();
    });
  });
});
