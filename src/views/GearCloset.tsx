import React, { FunctionComponent, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import {
  Seo,
  Heading,
  PageContainer,
  FlexContainer,
  Button,
  Table,
  Column,
  Row,
  Modal,
  LoadingPage,
} from '@components';
import usePersonalGear from '@hooks/usePersonalGear';
import GearClosetSetup from '@views/GearClosetSetup';
import { GearItemType } from '@common/gearItem';
import { FaPencilAlt, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';

type GearClosetProps = {};

const GearCloset: FunctionComponent<GearClosetProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const personalGear = usePersonalGear();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToBeDeleted, setItemToBeDeleted] = useState<GearItemType | undefined>(undefined);

  useFirestoreConnect([
    {
      collection: 'gear-closet',
      storeAs: 'gearCloset',
      doc: auth.uid,
    },
  ]);

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

  return (
    <PageContainer>
      <Seo title="Gear Closet" />
      {isLoaded(fetchedGearCloset) && fetchedGearCloset.length !== 0 && (
        <FlexContainer justifyContent="space-between">
          <Heading altStyle>Gear Closet</Heading>
          <Button type="link" to="/app/gear-closet/new" iconLeft={<FaPlusCircle />}>
            Add New Item
          </Button>
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

      {isLoaded(fetchedGearCloset) && fetchedGearCloset.length === 0 && <GearClosetSetup />}

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
    </PageContainer>
  );
};

export default GearCloset;
