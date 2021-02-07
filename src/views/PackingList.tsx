import React, { FunctionComponent } from 'react';
import lodash from 'lodash';

import { Box, Heading, PackingListItem } from '@components';
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
  return (
    <>
      <Box>
        <Heading as="h3" altStyle>
          Pre-Trip
        </Heading>
      </Box>
      {packingList &&
        packingList.length > 0 &&
        Object.entries(lodash.groupBy(packingList, 'category')).map((category) => (
          <Box key={category[0]}>
            <Heading as="h3" altStyle>
              {category[0]}
            </Heading>
            <ul style={{ padding: 0, listStyle: 'none' }}>
              {category[1]
                .sort((a, b) => {
                  // put essentials at the top, and sort alphabetical
                  if (a.isEssential === b.isEssential) {
                    return a.name.localeCompare(b.name);
                  }
                  return a.isEssential > b.isEssential ? -1 : 1;
                })
                .map((item) => (
                  <PackingListItem
                    key={item.name}
                    tripId={tripId}
                    editPackingItemClick={editPackingItemClick}
                    setActivePackingListItem={setActivePackingListItem}
                    item={item}
                  />
                ))}
            </ul>
          </Box>
        ))}
    </>
  );
};

export default PackingList;
