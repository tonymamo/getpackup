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
  tripMembers: TripMember[];
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

export type TripMember = {
  invitedAt: firebase.default.firestore.Timestamp;
  declinedAt?: firebase.default.firestore.Timestamp;
  acceptedAt?: firebase.default.firestore.Timestamp;
  status: TripMemberStatus;
  uid: string;
};

export enum TripMemberStatus {
  /** User has been invited, but not yet accepted */
  Pending = 'pending',
  /** User has accepted  */
  Accepted = 'accepted',
  /** User declined the invitation */
  Declined = 'declined',
  /** User created the trip */
  Owner = 'owner',
}
