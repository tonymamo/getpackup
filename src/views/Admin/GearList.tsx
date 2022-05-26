import { GearItemType } from '@common/gearItem';
import {
  Button,
  Column,
  FlexContainer,
  Heading,
  Modal,
  PageContainer,
  Row,
  Seo,
  Table,
} from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { FaPencilAlt, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebase, useFirestoreConnect } from 'react-redux-firebase';

type GearListProps = {};

const GearList: FunctionComponent<GearListProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItemType | undefined>(undefined);
  const gear = useSelector((state: RootState) => state.firestore.ordered.gear);
  useFirestoreConnect([{ collection: 'gear' }]);

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

  const deleteItem = (item: GearItemType) => {
    firebase
      .firestore()
      .collection('gear')
      .doc(item.id)
      .delete()
      .then()
      .catch((err) => {
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

  const sortedGearList =
    isLoaded(gear) &&
    !isEmpty(gear) &&
    gear &&
    gear.length > 0 &&
    [...gear].sort((a: GearItemType, b: GearItemType) => a.name.localeCompare(b.name));

  const data =
    isLoaded(gear) &&
    !isEmpty(gear) &&
    gear &&
    gear.length > 0 &&
    sortedGearList.map((item: GearItemType) => {
      return {
        ...item,
        actions: [
          {
            label: <FaPencilAlt />,
            to: `/admin/gear-list/${item.id}`,
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

  return (
    <PageContainer>
      <Seo title="Master Gear List" />
      <FlexContainer justifyContent="space-between">
        <Heading>Master Gear List</Heading>
        <Button type="link" to="/admin/gear-list/new" iconLeft={<FaPlusCircle />}>
          Add New Item
        </Button>
      </FlexContainer>

      <Table
        columns={columns}
        data={data || []}
        hasPagination
        hasSorting
        hasFiltering
        rowsPerPage={25}
        isLoading={!isLoaded(gear) || isEmpty(gear)}
      />

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
    </PageContainer>
  );
};

export default GearList;
