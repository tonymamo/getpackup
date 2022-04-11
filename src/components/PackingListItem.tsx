import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, FormikHelpers } from 'formik';
import styled from 'styled-components';
import { useFirebase, ExtendedFirebaseInstance } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  FaChevronRight,
  FaExclamationTriangle,
  FaPencilAlt,
  FaTrash,
  FaUsers,
} from 'react-icons/fa';
import { navigate } from 'gatsby';
import { RootState } from '@redux/ducks';
import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  LeadingActions,
  Type as ListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer, Pill, IconWrapper, Button } from '@components';
import { brandDanger, brandInfo, brandPrimary, lightestGray, offWhite } from '@styles/color';
import { PackingListItemType } from '@common/packingListItem';
import useWindowSize from '@utils/useWindowSize';
import trackEvent from '@utils/trackEvent';
import { UserType } from '@common/user';
import { LocalStorage } from '../utils/enums';
import Avatar, { StackedAvatars } from './Avatar';

type PackingListItemProps = {
  tripId: string;
  item: PackingListItemType;
  isOnSharedList?: boolean;
  isSharedTrip?: boolean;
};

const PackingListItemWrapper = styled.li`
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

const Form = styled.form`
  padding: ${halfSpacer};

  &:hover svg {
    visibility: visible;
  }
`;

const ItemInputWrapper = styled.div`
  /* flex: 1; */
`;

const ItemText = styled.div`
  flex: 1;
`;

type FormValues = {
  [name: string]: { isPacked: boolean };
};

const firebaseConnection = (firebase: ExtendedFirebaseInstance, tripId: string, itemId: string) => {
  return firebase
    .firestore()
    .collection('trips')
    .doc(tripId)
    .collection('packing-list')
    .doc(itemId);
};

const callbackDelay = 350;

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  const users: UserType[] = useSelector((state: RootState) => state.firestore.ordered.users);
  // const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const [removing, setRemoving] = useState(false);

  const onUpdate = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    firebaseConnection(firebase, props.tripId, props.item.id)
      .update({
        isPacked: values[props.item.id].isPacked,
      })
      .then(() => {
        resetForm({ values });
        trackEvent('Packing List Item isPacked Toggled', {
          tripId: props.tripId,
          item: props.item,
          isPacked: values[props.item.id].isPacked,
        });
      })
      .catch((err) => {
        trackEvent('Packing List Item isPacked Toggle Failure', {
          tripId: props.tripId,
          item: props.item,
          isPacked: values[props.item.id].isPacked,
        });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const onDelete = () => {
    firebaseConnection(firebase, props.tripId, props.item.id)
      .delete()
      .then(() => {
        trackEvent('Packing List Item Deleted', {
          tripId: props.tripId,
          item: props.item,
        });
      })
      .catch((err) => {
        trackEvent('Packing List Item Deleted Failure', {
          tripId: props.tripId,
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

  const onShare = () => {
    firebaseConnection(firebase, props.tripId, props.item.id)
      .update({
        // TOOD: can we assume packedBy[0] is ok?
        packedBy: [
          {
            ...props.item.packedBy[0],
            isShared: !props.item.packedBy[0].isShared,
          },
        ],
      })
      .then(() => {
        trackEvent('Packing List Item Shared', {
          tripId: props.tripId,
          item: props.item,
        });
      })
      .catch((err) => {
        trackEvent('Packing List Item Deleted Failure', {
          tripId: props.tripId,
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

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction onClick={onShare}>
        <Button
          type="button"
          color="secondary"
          style={{ borderRadius: 0, height: '100%' }}
          iconLeft={<FaUsers />}
        >
          Group Item
        </Button>
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive onClick={onDelete}>
        <Button
          type="button"
          color="danger"
          style={{ borderRadius: 0, height: '100%' }}
          iconLeft={<FaTrash />}
        >
          Delete
        </Button>
      </SwipeAction>
    </TrailingActions>
  );

  const handlePersistScrollPosition = (): void => {
    // eslint-disable-next-line no-unused-expressions
    window?.localStorage.setItem(LocalStorage.WindowOffsetTop, `${window.pageYOffset}`);
  };

  const handleItemSelect = (tripId: string, itemId: string): void => {
    handlePersistScrollPosition();
    navigate(`/app/trips/${tripId}/checklist/${itemId}`);
  };

  const itemIsShared = props.item.packedBy.some((item) => item.isShared);

  return (
    <PackingListItemWrapper className={removing ? 'removing' : undefined}>
      <SwipeableListItem
        listType={ListType.IOS}
        leadingActions={props.isSharedTrip ? leadingActions() : null}
        trailingActions={trailingActions()}
        destructiveCallbackDelay={callbackDelay}
        blockSwipe={!size.isSmallScreen} // only enable swiping for small screens
      >
        <Formik<FormValues>
          validateOnMount
          initialValues={{ [props.item.id]: { isPacked: props.item.isPacked } }}
          onSubmit={onUpdate}
        >
          {({ values, handleSubmit }) => (
            <Form onChange={handleSubmit}>
              <FlexContainer justifyContent="space-between">
                <ItemInputWrapper>
                  <Field
                    as={Input}
                    noMarginOnWrapper
                    name={`${props.item.id}.isPacked`}
                    type="checkbox"
                    checked={values[props.item.id].isPacked}
                    label=""
                  />
                </ItemInputWrapper>
                <ItemText>
                  <>
                    {props.item.isEssential && (
                      <span
                        data-tip="Essential Item"
                        data-for="essentialItem"
                        style={{ display: 'inline-block' }}
                      >
                        <FaExclamationTriangle color={brandDanger} />
                        <ReactTooltip
                          id="essentialItem"
                          place="top"
                          type="dark"
                          effect="solid"
                          className="tooltip customTooltip"
                        />
                      </span>
                    )}{' '}
                    {props.item.name}{' '}
                    {/* TODO: deprecate quantity and only user packedBy quanities added together? Or get rid of quantity on packedBy and not be able to break down total number by person */}
                    {props.item.quantity && props.item.quantity !== 1 && (
                      // || props.item.packedBy.length > 1) && (
                      // use Math.max to grab the larger of the two values, looking at the item's quantity field, or the quantities of all of the packedBy entries
                      <Pill
                        // text={`x ${Math.max(
                        //   props.item.quantity,
                        //   props.item.packedBy.reduce((partialSum, a) => partialSum + a.quantity, 0)
                        // )}`}
                        text={`x ${props.item.quantity}`}
                        color="neutral"
                        style={{ margin: 0, paddingTop: 2, paddingBottom: 2 }}
                      />
                    )}
                  </>
                </ItemText>

                {props.isOnSharedList && (
                  <StackedAvatars style={{ marginRight: halfSpacer }}>
                    {props.item.packedBy.map((packedByUser) => {
                      const matchingUser =
                        users &&
                        users.length > 0 &&
                        users.find((u: UserType) => u.uid === packedByUser.uid);
                      if (!matchingUser) return null;

                      return (
                        <Avatar
                          src={matchingUser.photoURL}
                          gravatarEmail={matchingUser.email}
                          key={matchingUser.uid}
                          size="xs"
                          username={matchingUser?.username.toLocaleLowerCase()}
                        />
                      );
                    })}
                  </StackedAvatars>
                )}

                {!size.isSmallScreen && (
                  <IconWrapper
                    onClick={() => handleItemSelect(props.tripId, props.item.id)}
                    hoverColor={brandPrimary}
                    color={lightestGray}
                    data-tip="Edit Item"
                    data-for="editItemIcon"
                  >
                    <FaPencilAlt />
                    <ReactTooltip
                      id="editItemIcon"
                      place="top"
                      type="dark"
                      effect="solid"
                      className="tooltip customTooltip"
                    />
                  </IconWrapper>
                )}

                {!size.isSmallScreen && (
                  <>
                    {!props.isOnSharedList && props.isSharedTrip && (
                      <IconWrapper
                        onClick={onShare}
                        data-tip={itemIsShared ? 'Shared Group Item' : 'Mark as Shared Group Item'}
                        data-for="sharedItemIcon"
                        hoverColor={brandInfo}
                        color={itemIsShared ? brandInfo : lightestGray}
                        style={{ marginRight: halfSpacer }}
                      >
                        <FaUsers />
                        <ReactTooltip
                          id="sharedItemIcon"
                          place="top"
                          type="dark"
                          effect="solid"
                          className="tooltip customTooltip"
                        />
                      </IconWrapper>
                    )}
                  </>
                )}
                {!size.isSmallScreen && (
                  // TODO: can anyone delete an item from the packing list? or just owners
                  <IconWrapper
                    onClick={onRemove}
                    data-tip="Delete Item"
                    data-for="deleteIcon"
                    hoverColor={brandDanger}
                    color={lightestGray}
                    style={{ marginRight: halfSpacer }}
                  >
                    <FaTrash />
                    <ReactTooltip
                      id="deleteIcon"
                      place="top"
                      type="dark"
                      effect="solid"
                      className="tooltip customTooltip"
                    />
                  </IconWrapper>
                )}

                {size.isSmallScreen && (
                  <>
                    {!props.isOnSharedList && itemIsShared && (
                      <IconWrapper
                        hoverColor={brandInfo}
                        color={brandInfo}
                        style={{ marginRight: halfSpacer }}
                        data-tip="Shared Group Item"
                        data-for="sharedItemIconSmall"
                      >
                        <FaUsers />
                        <ReactTooltip
                          id="sharedItemIconSmall"
                          place="top"
                          type="dark"
                          effect="solid"
                          className="tooltip customTooltip"
                        />
                      </IconWrapper>
                    )}
                    <IconWrapper
                      onClick={() => handleItemSelect(props.tripId, props.item.id)}
                      hoverColor={brandPrimary}
                      color={lightestGray}
                      data-tip="Edit Item"
                      data-for="editItemIconSmall"
                    >
                      <FaChevronRight />
                      <ReactTooltip
                        id="editItemIconSmall"
                        place="top"
                        type="dark"
                        effect="solid"
                        className="tooltip customTooltip"
                      />
                    </IconWrapper>
                  </>
                )}
              </FlexContainer>
            </Form>
          )}
        </Formik>
      </SwipeableListItem>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
