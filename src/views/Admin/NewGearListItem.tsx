import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { Seo, Heading, PageContainer } from '@components';
import GearListItemForm from '@views/Admin/GearListItemForm';
import { GearItemType } from '@common/gearItem';
import { gearListKeys } from '@utils/gearListItemEnum';

type NewGearListItemProps = {} & RouteComponentProps;

const NewGearListItem: FunctionComponent<NewGearListItemProps> = () => {
  const initialValues: GearItemType = {
    id: '',
    name: '',
    category: '',
    essential: false,
  };

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  return (
    <PageContainer>
      <Seo title="New Gear Item" />
      <Heading>New Item</Heading>
      <GearListItemForm initialValues={initialValues} type="new" />
    </PageContainer>
  );
};

export default NewGearListItem;
