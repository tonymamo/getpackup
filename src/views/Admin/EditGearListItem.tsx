import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { FaChevronLeft } from 'react-icons/fa';
import { navigate } from 'gatsby';

import { Seo, Heading, LoadingPage, PageContainer, Button } from '@components';
import { RootState } from '@redux/ducks';
import { GearItemType } from '@common/gearItem';
import GearListItemForm from './GearListItemForm';

type EditGearListItemProps = {
  id?: string;
} & RouteComponentProps;

const EditGearListItem: FunctionComponent<EditGearListItemProps> = (props) => {
  const gear = useSelector((state: RootState) => state.firestore.ordered.gear);
  useFirestoreConnect([{ collection: 'gear' }]);

  const activeItem: GearItemType = gear && gear.find((item: GearItemType) => item.id === props.id);

  const initialValues: GearItemType = activeItem;

  return (
    <PageContainer>
      <Seo title="Edit Gear Item" />
      <Button type="button" onClick={() => navigate(-1)} color="text" iconLeft={<FaChevronLeft />}>
        Back
      </Button>

      {activeItem && (
        <>
          <Heading>Edit Item</Heading>
          <GearListItemForm initialValues={initialValues} type="edit" />
        </>
      )}
      {(!activeItem || !isLoaded) && <LoadingPage />}
    </PageContainer>
  );
};

export default EditGearListItem;
