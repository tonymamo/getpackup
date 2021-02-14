import React, { FunctionComponent } from 'react';
import lodash from 'lodash';

import { Box, Heading, PackingListItem, PackingListAddItem } from '@components';
import { PackingListItemType } from '@common/packingListItem';

type PackingListProps = {
  tripId: string;
  packingList: PackingListItemType[];
  editPackingItemClick: () => void;
  setActivePackingListItem: (value: PackingListItemType) => void;
};

const PackingList: FunctionComponent<PackingListProps> = ({
  packingList,
  tripId,
  editPackingItemClick,
  setActivePackingListItem,
}) => {
  let groupedCategories: [string, PackingListItemType[]][] = [];

  if (packingList?.length) {
    groupedCategories = Object.entries(lodash.groupBy(packingList, 'category'));
  }

  return (
    <>
      <Box>
        <Heading as="h3" altStyle>
          Pre-Trip
        </Heading>
      </Box>
      {groupedCategories.map(
        ([categoryName, packingListItems]: [string, PackingListItemType[]]) => {
          const sortedItems = packingListItems.sort((a, b) => {
            // put essentials at the top, and sort by created timestamp (newest goes last)
            if (a.isEssential === b.isEssential) {
              return b.created.toDate() > a.created.toDate() ? -1 : 1;
            }

            return a.isEssential > b.isEssential ? -1 : 1;
          });

          return (
            <Box key={categoryName}>
              <Heading as="h3" altStyle>
                {categoryName}
              </Heading>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {sortedItems.map((item) => (
                  <PackingListItem
                    key={item.id}
                    tripId={tripId}
                    editPackingItemClick={editPackingItemClick}
                    setActivePackingListItem={setActivePackingListItem}
                    item={item}
                  />
                ))}
                <PackingListAddItem tripId={tripId} categoryName={categoryName} />
              </ul>
            </Box>
          );
        }
      )}
    </>
  );
};

export default PackingList;
