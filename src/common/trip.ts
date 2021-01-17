export type TripMember = { uid: string; displayName: string; photoURL: string; email: string };

export type TripType = {
  id: string;
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  timezoneOffset: number;
  created: firebase.firestore.Timestamp;
  tripMembers: Array<TripMember>;
  tags: Array<string>;
  tripLength: number;
};

export const trip = 'hello';
