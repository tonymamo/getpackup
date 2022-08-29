import 'react-swipeable-list/dist/styles.css';

import { ShoppingListItemType } from '@common/shoppingListItem';
import { Button, FlexContainer, IconWrapper, Input, Pill } from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { brandDanger, lightestGray, offWhite } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { FunctionComponent, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ExtendedFirebaseInstance, useFirebase } from 'react-redux-firebase';
import {
  Type as ListType,
  SwipeAction,
  SwipeableListItem,
  TrailingActions,
} from 'react-swipeable-list';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

type ShoppingListItemProps = {
  item: ShoppingListItemType;
};

const ShoppingListItemWrapper = styled.li`
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

const ItemText = styled.div<{ isChecked: boolean }>`
  flex: 1;
  word-break: break-all;
  text-decoration: ${({ isChecked }) => (isChecked ? 'line-through' : 'initial')};
`;

type FormValues = {
  [name: string]: { isChecked: boolean };
};

const firebaseConnection = (firebase: ExtendedFirebaseInstance, uid: string, itemId: string) => {
  return firebase.firestore().collection('shopping-list').doc(uid).collection('items').doc(itemId);
};

const callbackDelay = 350;

const ShoppingListItem: FunctionComponent<ShoppingListItemProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const [removing, setRemoving] = useState(false);

  const onUpdate = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    firebaseConnection(firebase, auth.uid, props.item.id)
      .update({
        isChecked: values[props.item.id].isChecked,
        updated: new Date(),
      })
      .then(() => {
        resetForm({ values });
        trackEvent('Shopping List Item isChecked Toggled', {
          item: props.item,
          isChecked: values[props.item.id].isChecked,
        });
      })
      .catch((err) => {
        trackEvent('Shopping List Item isChecked Toggle Failure', {
          item: props.item,
          isChecked: values[props.item.id].isChecked,
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
    firebaseConnection(firebase, auth.uid, props.item.id)
      .delete()
      .then(() => {
        trackEvent('Shopping List Item Deleted', {
          item: props.item,
        });
      })
      .catch((err) => {
        trackEvent('Shopping List Item Deleted Failure', {
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

  return (
    <ShoppingListItemWrapper className={removing ? 'removing' : undefined}>
      <SwipeableListItem
        listType={ListType.IOS}
        leadingActions={null}
        trailingActions={trailingActions()}
        destructiveCallbackDelay={callbackDelay}
        blockSwipe={!size.isSmallScreen} // only enable swiping for small screens
      >
        <Formik<FormValues>
          validateOnMount
          initialValues={{ [props.item.id]: { isChecked: props.item.isChecked } }}
          onSubmit={onUpdate}
        >
          {({ values, handleSubmit }) => (
            <Form onChange={handleSubmit}>
              <FlexContainer justifyContent="space-between">
                <ItemInputWrapper>
                  <Field
                    as={Input}
                    noMarginOnWrapper
                    name={`${props.item.id}.isChecked`}
                    type="checkbox"
                    checked={values[props.item.id].isChecked}
                    label=""
                  />
                </ItemInputWrapper>
                <ItemText isChecked={values[props.item.id].isChecked}>
                  <>
                    {props.item.name}{' '}
                    {props.item.quantity && props.item.quantity !== 1 && (
                      <Pill
                        text={`x ${props.item.quantity}`}
                        color="neutral"
                        style={{ margin: 0, paddingTop: 2, paddingBottom: 2 }}
                      />
                    )}
                  </>
                </ItemText>

                {!size.isSmallScreen && (
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
              </FlexContainer>
            </Form>
          )}
        </Formik>
      </SwipeableListItem>
    </ShoppingListItemWrapper>
  );
};

export default ShoppingListItem;
