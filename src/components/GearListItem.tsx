import 'react-swipeable-list/dist/styles.css';

import { GearItemType } from '@common/gearItem';
import { Button, FlexContainer, IconWrapper, Pill } from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { brandInfo, offWhite } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { navigate } from 'gatsby';
import React, { FunctionComponent, useState } from 'react';
import { FaChevronRight, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import {
  Type as ListType,
  SwipeAction,
  SwipeableListItem,
  TrailingActions,
} from 'react-swipeable-list';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

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

const callbackDelay = 350;

const GearListItem: FunctionComponent<GearListItemProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const [removing, setRemoving] = useState(false);

  const onDelete = () => {
    firebase
      .firestore()
      .collection('gear-closet')
      .doc(auth.uid)
      .update({
        removals: firebase.firestore.FieldValue.arrayUnion(props.item.id),
      })
      .then(() => {
        trackEvent('Gear Closet List Item Deleted', {
          uid: auth.uid,
          item: props.item,
        });
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
            <ItemText>
              {props.item.quantity && props.item.quantity !== 1 ? (
                <>
                  {props.item.name}{' '}
                  <Pill
                    text={`× ${props.item.quantity}`}
                    color="neutral"
                    style={{ margin: 0, paddingTop: 2, paddingBottom: 2 }}
                  />
                </>
              ) : (
                props.item.name
              )}
            </ItemText>
            {props.item.essential && (
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
