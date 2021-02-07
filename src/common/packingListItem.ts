export type PackingListItemType = {
  id: string;
  name: string;
  isPacked: boolean;
  category: string;
  isEssential: boolean;
  quantity: number;
  description?: string;
};
