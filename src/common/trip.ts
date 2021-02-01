export type TripType = {
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  timezoneOffset: number;
  created?: firebase.firestore.Timestamp;
  tripMembers: Array<string>;
  tags: Array<string>;
  tripLength: number;
};
