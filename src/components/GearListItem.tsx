import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { useFirebase, ExtendedFirebaseInstance } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FaChevronRight, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { navigate } from 'gatsby';
import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { FlexContainer, IconWrapper, Button } from '@components';
import { brandInfo, offWhite } from '@styles/color';
import { GearItemType } from '@common/gearItem';
import useWindowSize from '@utils/useWindowSize';
import trackEvent from '@utils/trackEvent';
import { RootState } from '@redux/ducks';

type GearListItemProps = {
  item: GearItemType;
};

const GearListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  transition: all 0.35s ease-out;
  max-height: 1000px;
  transform-origin: top;
  overflow: hidden;

  &:hover {
    background-color: ${offWhite};
  }

  &.removing {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const ListItemInner = styled.div`
  flex: 1;
  padding: ${halfSpacer};

  &:hover svg {
    visibility: visible;
  }
`;

const ItemText = styled.div`
  flex: 1;
`;

const firebaseConnection = (firebase: ExtendedFirebaseInstance, uid: string, itemId: string) => {
  return firebase
    .firestore()
    .collection('gear-closet')
    .doc(uid)
    .collection('packing-list')
    .doc(itemId);
};

const callbackDelay = 350;

const GearListItem: FunctionComponent<GearListItemProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const [removing, setRemoving] = useState(false);

  const onDelete = () => {
    firebaseConnection(firebase, auth.uid, props.item.id)
      .delete()
      .then(() => {
        trackEvent('Gear Closet List Item Deleted', {
          uid: auth.uid,
          item: props.item,
        });
        dispatch(
          addAlert({
            type: 'success',
            message: `${props.item.name} has been removed`,
          })
        );
      })
      .catch((err) => {
        trackEvent('Gear Closet List Item Delete Failure', {
          uid: auth.uid,
          item: props.item,
          error: err,
        });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const onRemove = () => {
    setRemoving(true);
    setTimeout(onDelete, callbackDelay);
  };

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive onClick={onDelete}>
        <Button type="button" color="danger" style={{ borderRadius: 0 }}>
          Delete
        </Button>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <GearListItemWrapper className={removing ? 'removing' : undefined}>
      <SwipeableListItem
        listType={ListType.IOS}
        trailingActions={trailingActions()}
        destructiveCallbackDelay={callbackDelay}
        blockSwipe={!size.isSmallScreen} // only enable swiping for small screens
      >
        <ListItemInner>
          <FlexContainer justifyContent="space-between">
            <ItemText>{props.item.name}</ItemText>
            {props.item.isEssential && (
              <IconWrapper data-tip="Essential Item" data-for="essentialItem">
                <FaExclamationTriangle color={brandInfo} />
                <ReactTooltip
                  id="essentialItem"
                  place="top"
                  type="dark"
                  effect="solid"
                  className="tooltip customTooltip"
                  delayShow={500}
                />
              </IconWrapper>
            )}
            {!size.isSmallScreen ? (
              <IconWrapper onClick={onRemove} style={{ marginRight: 10, visibility: 'hidden' }}>
                <FaTrash />
              </IconWrapper>
            ) : null}

            <IconWrapper onClick={() => navigate(`/app/gear-closet/${props.item.id}`)}>
              <FaChevronRight />
            </IconWrapper>
          </FlexContainer>
        </ListItemInner>
      </SwipeableListItem>
    </GearListItemWrapper>
  );
};

export default GearListItem;
