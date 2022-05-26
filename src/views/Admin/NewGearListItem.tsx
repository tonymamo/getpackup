import { GearItemType } from '@common/gearItem';
import { Heading, PageContainer, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import { gearListKeys } from '@utils/gearListItemEnum';
import GearListItemForm from '@views/Admin/GearListItemForm';
import React, { FunctionComponent } from 'react';

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
