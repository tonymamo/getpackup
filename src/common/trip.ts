export type TripType = {
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  timezoneOffset: number;
  lat: number;
  lng: number;
  created?: firebase.firestore.Timestamp;
  tripMembers: Array<string>;
  tags: Array<string>;
  tripLength: number;
};

export type TripFormType = Omit<TripType, 'startDate' | 'endDate'> & {
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
};
