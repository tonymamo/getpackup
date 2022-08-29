export type ShoppingListItemType = {
  isChecked: boolean;
  created: firebase.default.firestore.Timestamp;
  id: string;
  name: string;
  quantity: number;
  updated?: firebase.default.firestore.Timestamp;
};
