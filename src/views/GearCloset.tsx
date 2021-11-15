import React, { FunctionComponent, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { navigate } from 'gatsby';
import Select, { ValueType } from 'react-select';

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
import {
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import { multiSelectStyles } from '@components/Input';
import useWindowSize from '@utils/useWindowSize';
import { inputPaddingY } from '@styles/size';

type GearClosetProps = {};

type Category =
  | { value: string; label: string }
  | ValueType<{ value: keyof ActivityTypes; label: string }, false>;

const GearCloset: FunctionComponent<GearClosetProps> = () => {
  const size = useWindowSize();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const personalGear = usePersonalGear();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);

  const gearClosetCategories: Array<keyof ActivityTypes> = fetchedGearCloset?.[0]?.categories ?? [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItemType | undefined>(undefined);
  const [categoriesToAdd, setCategoriesToAdd] = useState<Category[]>([]);

  const [addNewCategoryModalIsOpen, setAddNewCategoryModalIsOpen] = useState(false);

  // the categories that the user DOES NOT have in the gear closet
  // also remove "essential" because that will always exist for users
  const getOtherCategories = (array: GearListEnumType) =>
    array.filter((item) => !gearClosetCategories.includes(item.name) && item.name !== 'essential');

  useEffect(() => {
    if (isLoaded(fetchedGearCloset) && fetchedGearCloset.length === 0) {
      navigate('/app/gear-closet/setup');
    }
  }, [fetchedGearCloset]);

  const gearListCategoryOptions = [
    {
      label: 'Activities',
      options: getOtherCategories(gearListActivities).map((item) => ({
        value: item.name,
        label: item.label,
      })),
    },
    {
      label: 'Accommodations',
      options: getOtherCategories(gearListAccommodations).map((item) => ({
        value: item.name,
        label: item.label,
      })),
    },
    {
      label: 'Camp Kitchen',
      options: getOtherCategories(gearListCampKitchen).map((item) => ({
        value: item.name,
        label: item.label,
      })),
    },
    {
      label: 'Other Considerations',
      options: getOtherCategories(gearListOtherConsiderations).map((item) => ({
        value: item.name,
        label: item.label,
      })),
    },
  ];

  useFirestoreConnect([
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
    {
      collection: 'trips',
      where: ['owner', '==', auth.uid],
    },
  ]);

  const saveAddedCategories = () => {
    trackEvent('Save Gear Category Button clicked');
    setAddNewCategoryModalIsOpen(false);
    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        categories: firebase.firestore.FieldValue.arrayUnion(
          ...categoriesToAdd.map((cat) => cat?.value)
        ),
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
    setCategoriesToAdd([]);
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

          <DropdownMenu width={290}>
            <button
              onClick={() => {
                setAddNewCategoryModalIsOpen(true);
                trackEvent('Add New Tag to Gear Closet Clicked');
              }}
              type="button"
            >
              <FaPlusCircle /> Add New Gear Category
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
        overflow="inherit"
      >
        <Heading>Add New Category</Heading>

        <p>
          Getting into a new sport or activity, or upgrading your gear? Select any category that
          applies to gear you own!
        </p>
        <Alert
          type="info"
          message="Note: selecting a new category will pre-populate new gear in your gear closet that you may want to customize after!"
        />
        <Select
          className="react-select"
          styles={multiSelectStyles}
          isMulti
          menuPlacement="auto"
          isSearchable={!size.isExtraSmallScreen}
          options={gearListCategoryOptions}
          onChange={(options) => setCategoriesToAdd(options as React.SetStateAction<Category[]>)}
        />
        {categoriesToAdd?.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'end', paddingTop: inputPaddingY }}>
            <Button type="button" iconLeft={<FaPlusCircle />} onClick={() => saveAddedCategories()}>
              Save
            </Button>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default GearCloset;
