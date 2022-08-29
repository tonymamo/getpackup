import { ShoppingListItemType } from '@common/shoppingListItem';
import {
  Box,
  DropdownMenu,
  FlexContainer,
  Heading,
  PageContainer,
  Seo,
  ShoppingListAddItem,
  ShoppingListItem,
} from '@components';
import { RootState } from '@redux/ducks';
import { lightGray } from '@styles/color';
import { halfSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

type ShoppingListProps = {};

const ItemsWrapper = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const ShoppingList: FunctionComponent<ShoppingListProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const shoppingList = useSelector((state: RootState) => state.firestore.ordered.shoppingList);
  const shoppingListItems: ShoppingListItemType[] = useSelector(
    (state: RootState) => state.firestore.ordered.shoppingListItems
  );
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: 'shopping-list',
      storeAs: 'shoppingList',
      doc: auth.uid,
    },
    {
      collection: 'shopping-list',
      storeAs: 'shoppingListItems',
      doc: auth.uid,
      subcollections: [{ collection: 'items' }],
    },
  ]);

  return (
    <PageContainer>
      <Seo title="Shopping List" />
      <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
        <div>
          <Heading altStyle style={{ display: 'inline' }}>
            Shopping List
          </Heading>
          <FaInfoCircle
            color={lightGray}
            style={{ marginLeft: halfSpacer }}
            data-tip="Packing for a trip and want to keep track of everything you need to buy? Add it here for a quick checklist next time you are at the store."
            data-for="info"
          />
          <ReactTooltip
            id="info"
            place="top"
            type="dark"
            effect="solid"
            className="tooltip customTooltip customTooltip200"
          />
        </div>
        <div>
          <DropdownMenu width={290}>👋🏼</DropdownMenu>
        </div>
      </FlexContainer>
      <br />
      <Box>
        <ItemsWrapper>
          {shoppingListItems &&
            shoppingListItems.length > 0 &&
            shoppingListItems
              .sort((a, b) => {
                // if both are checked, or both are unchecked, sort by timestamp, or name if the same timestamp
                if (a?.isChecked === b?.isChecked) {
                  // sort by name
                  if (a?.created?.seconds === b?.created?.seconds) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                  }
                  // sort by timestamp
                  return b.created.toDate() > a.created.toDate() ? -1 : 1;
                }
                // sort by checked status, with checked items last
                return a.isChecked > b.isChecked ? 1 : -1;
              })
              .map((item) => <ShoppingListItem item={item} key={item.id} />)}
          <ShoppingListAddItem />
        </ItemsWrapper>
      </Box>
    </PageContainer>
  );
};

export default ShoppingList;
