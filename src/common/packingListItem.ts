export type PackingListItemType = {
  id: string;
  name: string;
  isPacked: boolean;
  category: string;
  isEssential: boolean;
  quantity: number;
  description?: string;
  weight?: string;
  weightUnit?: 'g' | 'kg' | 'oz' | 'lb';
  created: firebase.default.firestore.Timestamp;
  updated?: firebase.default.firestore.Timestamp;
};
