import { UserType } from './user';

export type TripMember = UserType;

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
  tripMembers: Array<TripMember>;
  tags: Array<string>;
  tripLength: number;
};
