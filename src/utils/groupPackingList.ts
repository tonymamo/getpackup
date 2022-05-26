import { PackingListItemType } from '@common/packingListItem';
import groupBy from 'lodash/groupBy';

import { TabOptions } from './enums';

const groupPackingList = (list: PackingListItemType[], uid: string, typeOfList: TabOptions) => {
  // Only grab items that belong to the logged in user, and any shared items
  const userOrSharedPackingList = list.filter(
    (packingListItem: PackingListItemType) =>
      packingListItem &&
      packingListItem.packedBy &&
      packingListItem.packedBy.length > 0 &&
      packingListItem.packedBy.some((item) =>
        typeOfList === TabOptions.Personal ? item.uid === uid : item.isShared
      )
  );

  // group them by category
  const entries = Object.entries(groupBy(userOrSharedPackingList, 'category'));

  // find all the pre-trip category
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const preTripEntries = entries.filter((item) => item[0] === 'Pre-Trip')!;
  // then grab all the other categories
  const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');

  // categories already come in sorted from useFirestoreConnect in tripById, so just add them after pre-trip
  return [...preTripEntries, ...allOtherEntries];
};

export default groupPackingList;
