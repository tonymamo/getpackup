import React, { FunctionComponent } from 'react';
import lodash from 'lodash';
import { RouteComponentProps } from '@reach/router';

import {
  PackingListCategory,
  PackingListNavigation,
  packingListNavigationHeight,
} from '@components';
import { PackingListItemType } from '@common/packingListItem';

type PackingListProps = {
  tripId: string;
  packingList: PackingListItemType[];
} & RouteComponentProps;

const PackingList: FunctionComponent<PackingListProps> = ({ packingList, tripId }) => {
  const groupedCategories: [string, PackingListItemType[]][] = [];

  if (packingList?.length) {
    // Put the pre-trip category first, if it exists
    const entries = Object.entries(lodash.groupBy(packingList, 'category'));
    const preTripEntries = entries.find((item) => item[0] === 'Pre-Trip');
    const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');
    if (preTripEntries) groupedCategories.push(preTripEntries);
    groupedCategories.push(...allOtherEntries);
  }

  return (
    <>
      <PackingListNavigation tripId={tripId} />
      <div style={{ paddingTop: packingListNavigationHeight }}>
        {groupedCategories.map(
          ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
            const sortedItems = packingListItems.sort((a, b) => {
              // put essentials at the top, and sort by created timestamp (newest goes last)
              if (!a.isEssential && !b.isEssential) {
                if (a.created.seconds === b.created.seconds) {
                  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                }
                return b.created.toDate() > a.created.toDate() ? -1 : 1;
              }
              return a.isEssential > b.isEssential ? -1 : 1;
            });

            return (
              <PackingListCategory
                key={categoryName}
                categoryName={categoryName}
                sortedItems={sortedItems}
                tripId={tripId}
              />
            );
          }
        )}
      </div>
    </>
  );
};

export default PackingList;
