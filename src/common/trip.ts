export enum TripMemberStatus {
  /** User is the one who created the trip */
  Owner = 'Owner',
  /** User has been invited, but not yet accepted */
  Pending = 'Pending',
  /** User has accepted  */
  Accepted = 'Accepted',
  /** User declined the invitation */
  Declined = 'Declined',
  /** Removed by trip owner */
  Removed = 'Removed',
}

export type TripMember = {
  invitedAt: firebase.default.firestore.Timestamp;
  declinedAt?: firebase.default.firestore.Timestamp;
  acceptedAt?: firebase.default.firestore.Timestamp;
  removedAt?: firebase.default.firestore.Timestamp;
  status: TripMemberStatus;
  uid: string;
  invitedBy?: string;
};

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
  tripMembers: { [key: string]: TripMember }; // note keys are UIDs, but uid is also in object. Use Object.(keys/values) everywhere to get what you need
  tags: Array<string>;
  tripLength: number;
  headerImage?: string;
  archived?: boolean;
  collapsedCategories?: { [key: string]: string[] };
};

export type TripFormType = Omit<TripType, 'startDate' | 'endDate'> & {
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
};
