import React, { FunctionComponent, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase, useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { FaPencilAlt, FaPlusCircle, FaTrash } from 'react-icons/fa';

import { RootState } from '@redux/ducks';
import {
  Seo,
  Button,
  FlexContainer,
  Heading,
  LoadingPage,
  Table,
  Modal,
  Row,
  Column,
  Box,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';

type GearListProps = {};

export type GearItem = {
  id: string;
  name: string;
  category: string;
  lastEditedBy?: string;
  [key: string]: boolean | string | undefined; // all the rest... TODO: move all items to a master list somewhere?
};

const GearList: FunctionComponent<GearListProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItem | undefined>(undefined);
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
      },
    ],
    []
  );

  const deleteItem = (item: GearItem) => {
    firebase
      .firestore()
      .collection('gear')
      .doc(item.id)
      .delete()
      .then(() => {
        dispatch(
          addAlert({
            type: 'success',
            message: `Successfully deleted ${item.name}`,
          })
        );
      })
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

  const data =
    gear &&
    gear.length > 0 &&
    gear.map((item: GearItem) => {
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
            color: 'danger',
            onClick: () => {
              setModalIsOpen(true);
              setItemToBeDeleted(item);
            },
          },
        ],
      };
    });

  return (
    <Box>
      <Seo title="Master Gear List" />
      <FlexContainer justifyContent="space-between">
        <Heading>Master Gear List</Heading>
        <Button type="link" to="/admin/gear-list/new" iconLeft={<FaPlusCircle />}>
          Add New Item
        </Button>
      </FlexContainer>
      {gear && (
        <Table
          columns={columns}
          data={data}
          hasPagination
          hasSorting
          hasFiltering
          rowsPerPage={25}
        />
      )}
      {(!isLoaded(gear) || !isEmpty(gear)) && <LoadingPage />}
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
    </Box>
  );
};

export default GearList;
