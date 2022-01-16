/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const chunk = require('lodash/chunk');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

exports.copyOwnerToTripMembers = functions.https.onRequest(async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection('trips')
    .get();
  const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

  /**
   * `chunk` function splits the array into chunks up to the provided length.
   * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
   */
  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const batch of batches) {
    batch.forEach((doc) => {
      if (!doc.get('tripMembers') || !doc.get('owner')) {
        return;
      }
      const writeBatch = admin.firestore().batch();
      //   console.log(doc.get('tripMembers'));
      const ownerAlreadyAMember =
        doc.get('tripMembers').length > 0
          ? doc.get('tripMembers').some((member) => member === doc.get('owner'))
          : false;
      if (!ownerAlreadyAMember && doc.get('owner')) {
        console.log([...doc.get('tripMembers'), doc.get('owner')]);
        writeBatch.update(doc.ref, { tripMembers: [...doc.get('tripMembers'), doc.get('owner')] });
        commitBatchPromises.push(writeBatch.commit());
      }
    });
  }
  res.send(`Updated tripMembers for ${commitBatchPromises.length} trips`);
  await Promise.all(commitBatchPromises);
});

exports.convertTripMembersToInviteObject = functions.https.onRequest(async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection('trips')
    .get();
  const MAX_WRITES_PER_BATCH = 500; /** https://cloud.google.com/firestore/quotas#writes_and_transactions */

  /**
   * `chunk` function splits the array into chunks up to the provided length.
   * - Or one of [these answers](https://stackoverflow.com/questions/8495687/split-array-into-chunks#comment84212474_8495740)
   */
  const batches = chunk(snapshot.docs, MAX_WRITES_PER_BATCH);
  const commitBatchPromises = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const batch of batches) {
    batch.forEach((doc) => {
      if (!doc.get('tripMembers') || !doc.get('owner')) {
        return;
      }
      const writeBatch = admin.firestore().batch();
      const tripMemberListToWrite = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const member of doc.get('tripMembers')) {
        tripMemberListToWrite.push({
          invitedAt: doc.get('created'),
          acceptedAt: doc.get('created'),
          status: doc.get('owner') === member ? 'Owner' : 'Accepted',
          uid: member,
        });
      }
      writeBatch.update(doc.ref, { tripMembers: tripMemberListToWrite });
      commitBatchPromises.push(writeBatch.commit());
    });
  }
  res.send(`Updated tripMembers for ${commitBatchPromises.length} trips`);
  await Promise.all(commitBatchPromises);
});

exports.addOwnerToPackingListItems = functions.https.onRequest(async (req, res) => {
  const tripsSnapshot = await admin
    .firestore()
    .collection('trips')
    .get();

  tripsSnapshot.docs.forEach(async (trip) => {
    const packingListItemsSnapshot = await trip.ref.collection('packing-list').get();
    const tripOwner = trip.get('owner');

    packingListItemsSnapshot.docs.forEach(async (item) => {
      if (tripOwner) {
        await item.ref.update({
          ...item.data(),
          packedBy: [
            {
              uid: tripOwner,
              quantity: item.get('quantity') ?? 1,
              isShared: false,
            },
          ],
        });
      }
    });
  });

  res.send(`Added owner to packing list item for ${tripsSnapshot.docs.length} trips`);
});
