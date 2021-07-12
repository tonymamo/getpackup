import React, { FunctionComponent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import * as icons from 'react-icons/all';

import {
  Seo,
  Heading,
  PageContainer,
  Button,
  Table,
  Column,
  Row,
  Modal,
  LoadingPage,
  Alert,
  HorizontalScroller,
  DropdownMenu,
  FlexContainer,
} from '@components';
import usePersonalGear from '@hooks/usePersonalGear';
import { ActivityTypes, GearItemType, GearListEnumType } from '@common/gearItem';
import { FaPencilAlt, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import trackEvent from '@utils/trackEvent';
import { TripType } from '@common/trip';
import { IconWrapperLabel, IconCheckboxLabel } from '@components/IconCheckbox';
import { lightGray } from '@styles/color';
import { tripleSpacer } from '@styles/size';
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';

type GearClosetProps = {};

const GearCloset: FunctionComponent<GearClosetProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const personalGear = usePersonalGear();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);

  const gearClosetCategories: Array<keyof ActivityTypes> = fetchedGearCloset?.[0]?.categories ?? [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItemType | undefined>(undefined);

  const [addNewCategoryModalIsOpen, setAddNewCategoryModalIsOpen] = useState(false);

  useFirestoreConnect([
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

  const updateUsersGearClosetCategories = (categoryToAdd: string) => {
    setAddNewCategoryModalIsOpen(false);
    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        categories: firebase.firestore.FieldValue.arrayUnion(categoryToAdd),
      })
      .then(() => {})
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const renderDynamicIcon = (comboName: string) => {
    const [, iconName] = comboName.split('/');
    const Icon = icons[iconName];
    return <Icon color={lightGray} size={tripleSpacer} />;
  };

  const personalGearIsLoading = personalGear === 'loading';

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
      },
      {
        header: 'Category',
        accessor: 'category',
      },
      {
        header: 'Action',
        accessor: 'action',
        disableSortBy: true,
      },
    ],
    []
  );

  const sortedGearList = () => {
    return !personalGearIsLoading && personalGear?.length && personalGear.length > 0
      ? [...(personalGear as Array<GearItemType>)].sort((a: GearItemType, b: GearItemType) =>
          a.name.localeCompare(b.name)
        )
      : [];
  };

  const data = sortedGearList().map((item: GearItemType) => {
    return {
      ...item,
      actions: [
        {
          label: <FaPencilAlt />,
          to: `/app/gear-closet/${item.id}`,
          color: 'primaryOutline',
        },
        {
          label: <FaTrash />,
          color: 'dangerOutline',
          onClick: () => {
            setModalIsOpen(true);
            setItemToBeDeleted(item);
          },
        },
      ],
    };
  });

  const deleteItem = (item: GearItemType) => {
    const deleteType = () => {
      if (item.isCustomGearItem) {
        // Custom item, so delete it from the user's Additions collection
        return firebase
          .firestore()
          .collection('gear-closet')
          .doc(auth.uid)
          .collection('additions')
          .doc(item.id)
          .delete();
      }
      // Not a custom gear item, so add to Removals list
      return firebase
        .firestore()
        .collection('gear-closet')
        .doc(auth.uid)
        .update({
          removals: firebase.firestore.FieldValue.arrayUnion(item.id),
        });
    };

    deleteType()
      .then(() => {
        trackEvent('Gear Closet Item Deleted', { ...item });
      })
      .catch((err) => {
        trackEvent('Gear Closet Item Delete Failure', { ...item, err });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
    setItemToBeDeleted(undefined);
    setModalIsOpen(false);
  };

  // the categories that the user DOES NOT have in the gear closet
  // also remove "essential" because that will always exist for users
  const getOtherCategories = (array: GearListEnumType) =>
    array.filter((item) => !gearClosetCategories.includes(item.name) && item.name !== 'essential');

  if (isLoaded(fetchedGearCloset) && fetchedGearCloset.length === 0) {
    navigate('/app/gear-closet/setup');
  }

  return (
    <PageContainer>
      <Seo title="Gear Closet" />

      {isLoaded(trips) && trips.length === 0 && (
        <Alert
          type="info"
          message="Looks like you have some gear now, start customizing it by adding or removing items, or go create your first trip!"
          callToActionLink="/app/trips/new"
          callToActionLinkText="Create a trip"
        />
      )}

      {isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0 && (
        <FlexContainer justifyContent="space-between" alignItems="flex-start">
          <p>
            <Button
              type="link"
              to="/app/gear-closet/new"
              iconLeft={<FaPlusCircle />}
              block
              onClick={() => trackEvent('New Gear Closet Item Button clicked')}
            >
              Add New Item
            </Button>
          </p>

          <DropdownMenu>
            <button
              onClick={() => {
                setAddNewCategoryModalIsOpen(true);
                trackEvent('Add New Tag to Gear Closet Clicked');
              }}
              type="button"
            >
              <FaPlusCircle /> Add New Gear Tag
            </button>
          </DropdownMenu>
        </FlexContainer>
      )}

      {isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0 && (
        <Table
          columns={columns}
          data={data || []}
          hasPagination
          hasSorting
          hasFiltering
          rowsPerPage={25}
          isLoading={personalGearIsLoading}
        />
      )}

      {!isLoaded(fetchedGearCloset) && <LoadingPage />}

      {itemToBeDeleted && (
        <Modal
          toggleModal={() => {
            setItemToBeDeleted(undefined);
            setModalIsOpen(false);
          }}
          isOpen={modalIsOpen}
        >
          <Heading>Are you sure?</Heading>
          <p>
            Are you sure you want to delete <strong>{itemToBeDeleted.name}</strong>? This action
            cannot be undone.
          </p>
          <Row>
            <Column xs={6}>
              <Button
                type="button"
                onClick={() => {
                  setItemToBeDeleted(undefined);
                  setModalIsOpen(false);
                }}
                color="primaryOutline"
                block
              >
                Cancel
              </Button>
            </Column>
            <Column xs={6}>
              <Button
                type="button"
                onClick={() => deleteItem(itemToBeDeleted)}
                block
                color="danger"
                iconLeft={<FaTrash />}
              >
                Delete
              </Button>
            </Column>
          </Row>
        </Modal>
      )}

      <Modal
        toggleModal={() => {
          setAddNewCategoryModalIsOpen(false);
        }}
        isOpen={addNewCategoryModalIsOpen}
      >
        <Heading>Add New Category</Heading>
        <Alert
          type="info"
          message="Note: selecting a new tag will pre-populate new gear in your gear closet that you may want to customize after!"
        />
        <p>
          <strong>Activities</strong>
        </p>
        <HorizontalScroller withBorder>
          {getOtherCategories(gearListActivities).map((item) => (
            <li key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </li>
          ))}
        </HorizontalScroller>
        <br />
        <p>
          <strong>Accommodations</strong>
        </p>
        <HorizontalScroller withBorder>
          {getOtherCategories(gearListAccommodations).map((item) => (
            <li key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </li>
          ))}
        </HorizontalScroller>
        <br />
        <p>
          <strong>Camp Kitchen</strong>
        </p>
        <HorizontalScroller withBorder>
          {getOtherCategories(gearListCampKitchen).map((item) => (
            <li key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </li>
          ))}
        </HorizontalScroller>
        <br />
        <p>
          <strong>Other Considerations</strong>
        </p>
        <HorizontalScroller withBorder>
          {getOtherCategories(gearListOtherConsiderations).map((item) => (
            <li key={item.name}>
              <IconWrapperLabel
                onClick={() => {
                  updateUsersGearClosetCategories(item.name);
                }}
              >
                {renderDynamicIcon(item.icon)}
                <IconCheckboxLabel>{item.label}</IconCheckboxLabel>
              </IconWrapperLabel>
            </li>
          ))}
        </HorizontalScroller>
      </Modal>
    </PageContainer>
  );
};

export default GearCloset;
