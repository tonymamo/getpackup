export type TripType = {
  owner: string;
  tripId: string;
  name: string;
  description: string;
  startingPoint: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: firebase.default.firestore.Timestamp;
  endDate: firebase.default.firestore.Timestamp;
  timezoneOffset: number;
  lat: number;
  lng: number;
  created?: firebase.default.firestore.Timestamp;
  updated?: firebase.default.firestore.Timestamp;
  tripMembers: Array<string>;
  tags: Array<string>;
  tripLength: number;
  headerImage?: string;
  archived?: boolean;
  collapsedCategories?: string[];
};

export type TripFormType = Omit<TripType, 'startDate' | 'endDate'> & {
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
};
