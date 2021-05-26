export type PackingListItemType = {
  id: string;
  name: string;
  isPacked: boolean;
  category: string;
  isEssential: boolean;
  quantity: number;
  description?: string;
  created: firebase.firestore.Timestamp;
  updated?: firebase.firestore.Timestamp;
};
