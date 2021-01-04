import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { Seo, Box, Heading } from '@components';
import GearListItemForm from '@views/Admin/GearListItemForm';
import { GearItem } from '@views/Admin/GearList';
import { gearListKeys } from '@utils/gearListItemEnum';

type NewGearListItemProps = {} & RouteComponentProps;

const NewGearListItem: FunctionComponent<NewGearListItemProps> = () => {
  const initialValues: GearItem = {
    id: '',
    name: '',
    category: '',
    lastEditedBy: '',
  };

  gearListKeys.forEach((item) => {
    initialValues[item] = false;
  });

  return (
    <>
      <Seo title="New Gear Item" />
      <Box>
        <Heading>New Item</Heading>
        <GearListItemForm initialValues={initialValues} type="new" />
      </Box>
    </>
  );
};

export default NewGearListItem;
