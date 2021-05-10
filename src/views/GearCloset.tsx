import React, { FunctionComponent } from 'react';
import groupBy from 'lodash/groupBy';

import { Seo, Heading, PageContainer, GearListCategory } from '@components';
import usePersonalGear from '@hooks/usePersonalGear';
import GearClosetSetup from '@views/GearClosetSetup';
import { GearItemType } from '@common/gearItem';

type GearClosetProps = {};

const GearCloset: FunctionComponent<GearClosetProps> = () => {
  const personalGear = usePersonalGear();

  const groupedCategories: [string, GearItemType[]][] = [];

  if (personalGear?.length) {
    // Put the pre-trip category first, if it exists
    const entries = Object.entries(groupBy(personalGear, 'category'));
    const preTripEntries = entries.find((item) => item[0] === 'Pre-Trip');
    const allOtherEntries = entries.filter((item) => item[0] !== 'Pre-Trip');
    if (preTripEntries) groupedCategories.push(preTripEntries);
    groupedCategories.push(...allOtherEntries);
  }

  // TODO: If the activities array is empty, show the setup page
  return <GearClosetSetup />;

  // return (
  //   <PageContainer>
  //     <Seo title="Gear Closet" />
  //     <Heading as="h2" altStyle>
  //       Gear Closet
  //     </Heading>

  //     {groupedCategories.map(([categoryName, gearListItems]: [string, GearItemType[]]) => {
  //       const sortedItems = gearListItems.sort((a, b) => {
  //         return a.essential > b.essential ? -1 : 1;
  //       });

  //       return (
  //         <GearListCategory
  //           key={categoryName}
  //           categoryName={categoryName}
  //           sortedItems={sortedItems}
  //         />
  //       );
  //     })}
  //   </PageContainer>
  // );
};

export default GearCloset;
