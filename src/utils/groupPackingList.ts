import { PackingListItemType } from "@common/packingListItem";
import groupBy from 'lodash/groupBy';

const groupPackingList = (list: PackingListItemType[]) => {
  const groupedCategories: [string, PackingListItemType[]][] = [];

  const entries = Object.entries(groupBy(list, 'category'));
  const preTripEntries = entries.find((item) => item[0] === 'Pre-Trip');
  const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');
  if (preTripEntries) groupedCategories.push(preTripEntries);
  groupedCategories.push(...allOtherEntries);
  return groupedCategories;
};

export default groupPackingList;