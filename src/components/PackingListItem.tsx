import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, FormikHelpers } from 'formik';
import styled from 'styled-components';
import { useFirebase, ExtendedFirebaseInstance } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
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
import { Input, FlexContainer, Pill, IconWrapper, Button } from '@components';
import { brandDanger, offWhite } from '@styles/color';
import { PackingListItemType } from '@common/packingListItem';
import useWindowSize from '@utils/useWindowSize';
import trackEvent from '@utils/trackEvent';
import { LocalStorage } from '../enums';

type PackingListItemProps = {
  tripId: string;
  item: PackingListItemType;
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

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive onClick={onDelete}>
        <Button type="button" color="danger" style={{ borderRadius: 0 }}>
          Delete
        </Button>
      </SwipeAction>
    </TrailingActions>
  );

  const handlePersistScrollPosition = (): void => {
    window?.localStorage.setItem(LocalStorage.WindowOffsetTop, `${window.pageYOffset}`);
  };

  const handleItemSelect = (tripId: string, itemId: string): void => {
    handlePersistScrollPosition();
    navigate(`/app/trips/${tripId}/checklist/${itemId}`);
  };

  return (
    <PackingListItemWrapper className={removing ? 'removing' : undefined}>
      <SwipeableListItem
        listType={ListType.IOS}
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
                {props.item.isEssential && (
                  <IconWrapper data-tip="Essential Item" data-for="essentialItem">
                    <FaExclamationTriangle color={brandDanger} />
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
                  <IconWrapper
                    onClick={onRemove}
                    style={{ marginRight: halfSpacer, visibility: 'hidden' }}
                  >
                    <FaTrash />
                  </IconWrapper>
                ) : null}

                <IconWrapper
                  onClick={() =>  handleItemSelect(props.tripId, props.item.id)}
                >
                  <FaChevronRight />
                </IconWrapper>
              </FlexContainer>
            </Form>
          )}
        </Formik>
      </SwipeableListItem>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
