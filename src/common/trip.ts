export enum TripMemberStatus {
  /** User is the one who created the trip */
  Owner = 'Owner',
  /** User has been invited, but not yet accepted */
  Pending = 'Pending',
  /** User has accepted  */
  Accepted = 'Accepted',
  /** User declined the invitation */
  Declined = 'Declined',
}

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
  pendingTripMembers?: Array<string>;
  declinedTripMembers?: Array<string>;
  tripMembers: Array<{
    invitedAt?: firebase.default.firestore.Timestamp;
    declinedAt?: firebase.default.firestore.Timestamp;
    acceptedAt?: firebase.default.firestore.Timestamp;
    status: TripMemberStatus;
    uid: string;
  }>;
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
