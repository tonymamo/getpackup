import React, { FunctionComponent } from 'react';
import lodash from 'lodash';

import { Box, Heading, PackingListItem, PackingListAddItem } from '@components';
import { PackingListItemType } from '@common/packingListItem';

type GroupedCategoryProps = {
  categoryName: string;
  packingListItems: PackingListItemType[];
  tripId: string;
  editPackingItemClick: () => void;
  setActivePackingListItem: (value: PackingListItemType) => void;
};

const GroupedCategoryList = ({
  categoryName,
  packingListItems,
  tripId,
  editPackingItemClick,
  setActivePackingListItem,
}: GroupedCategoryProps) => {
  const sortedItems = packingListItems.sort((a, b) => {
    // put essentials at the top, and sort alphabetical
    if (a.isEssential === b.isEssential) {
      return a.name.localeCompare(b.name);
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
            key={item.name}
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
};

type PackingListProps = {
  tripId: string;
  packingList: PackingListItemType[];
  editPackingItemClick: () => void;
  setActivePackingListItem: (value: PackingListItemType) => void;
};

const PackingList: FunctionComponent<PackingListProps> = ({ packingList, ...rest }) => {
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
        ([categoryName, packingListItems]: [string, PackingListItemType[]]) => (
          <GroupedCategoryList
            key={categoryName}
            categoryName={categoryName}
            packingListItems={packingListItems}
            {...rest}
          />
        )
      )}
    </>
  );
};

export default PackingList;
