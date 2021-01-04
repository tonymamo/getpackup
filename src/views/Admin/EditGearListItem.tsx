import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { Seo, Box, Heading, LoadingPage } from '@components';
import { RootState } from '@redux/ducks';
import GearListItemForm from './GearListItemForm';
import { GearItem } from './GearList';

type EditGearListItemProps = {
  id?: string;
} & RouteComponentProps;

const EditGearListItem: FunctionComponent<EditGearListItemProps> = (props) => {
  const gear = useSelector((state: RootState) => state.firestore.ordered.gear);
  useFirestoreConnect([{ collection: 'gear' }]);

  const activeItem: GearItem = gear && gear.find((item: GearItem) => item.id === props.id);

  const initialValues: GearItem = activeItem;

  return (
    <>
      <Seo title="Edit Gear Item" />
      <Box>
        {activeItem && (
          <>
            <Heading>Edit Item</Heading>
            <GearListItemForm initialValues={initialValues} type="edit" />
          </>
        )}
        {(!activeItem || !isLoaded) && <LoadingPage />}
      </Box>
    </>
  );
};

export default EditGearListItem;
