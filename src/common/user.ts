export type UserType = {
  bio?: string;
  displayName: string;
  email: string;
  // id: string; // dont use this, prefer uid instead
  isAdmin?: boolean;
  location?: string;
  photoURL?: string;
  searchableIndex: Array<{ [key: string]: boolean }>;
  uid: string;
  username: string;
  website?: string;
  lastUpdated?: firebase.firestore.Timestamp;
};
