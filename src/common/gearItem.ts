export type GearItem = {
  id: string;
  name: string;
  category: string;
  lastEditedBy?: string;
  essential: boolean;
  [key: string]: boolean | string | undefined; // all the rest... TODO: type rest of the fields out
};
