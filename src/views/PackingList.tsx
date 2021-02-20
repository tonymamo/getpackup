import React, { FunctionComponent } from 'react';
import lodash from 'lodash';
import { RouteComponentProps } from '@reach/router';

import { Box, Heading, PackingListItem, PackingListAddItem } from '@components';
import { PackingListItemType } from '@common/packingListItem';

type PackingListProps = {
  tripId: string;
  packingList: PackingListItemType[];
} & RouteComponentProps;

const PackingList: FunctionComponent<PackingListProps> = ({ packingList, tripId }) => {
  let groupedCategories: [string, PackingListItemType[]][] = [];

  if (packingList?.length) {
    const entries = Object.entries(lodash.groupBy(packingList, 'category'));

    groupedCategories = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      entries.find((item) => item[0] === 'Pre-Trip')!,
      ...entries.filter((item) => item[0] !== 'Pre-Trip'),
    ];
  }

  return (
    <>
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
              <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
                {sortedItems.map((item) => (
                  <PackingListItem key={item.id} tripId={tripId} item={item} />
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
