export type UserType = {
  bio?: string;
  displayName: string;
  email: string;
  emergencyContacts?: Array<{ name: string; email: string; phoneNumber: string }>;
  // id: string; // dont use this, prefer uid instead
  isAdmin?: boolean;
  location?: string;
  photoURL?: string;
  profileHeaderImage?: string;
  searchableIndex: Array<{ [key: string]: boolean }>;
  uid: string;
  username: string;
  website?: string;
  lastUpdated?: firebase.default.firestore.Timestamp;
  createdAt?: firebase.default.firestore.Timestamp;
};
