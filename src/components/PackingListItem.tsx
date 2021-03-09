import React, { FunctionComponent } from 'react';
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
import { Input, FlexContainer, Pill, IconWrapper } from '@components';
import { brandInfo, offWhite } from '@styles/color';
import { PackingListItemType } from '@common/packingListItem';
import Button from '@components/Button';
import useWindowSize from '@utils/useWindowSize';

type PackingListItemProps = {
  tripId: string;
  item: PackingListItemType;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};

  &:hover {
    background-color: ${offWhite};
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

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const size = useWindowSize();

  const onCreate = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    firebaseConnection(firebase, props.tripId, props.item.id)
      .update({
        isPacked: values[props.item.name].isPacked,
      })
      .then(() => {
        resetForm({ values });
      })
      .catch((err) => {
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
        dispatch(
          addAlert({
            type: 'success',
            message: `${props.item.name} has been removed`,
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
    <PackingListItemWrapper>
      <SwipeableListItem
        listType={ListType.IOS}
        trailingActions={trailingActions()}
        destructiveCallbackDelay={350}
        blockSwipe={!size.isSmallScreen} // only enable swiping for small screens
      >
        <Formik<FormValues>
          validateOnMount
          initialValues={{ [props.item.name]: { isPacked: props.item.isPacked } }}
          onSubmit={onCreate}
        >
          {({ values, handleSubmit }) => (
            <Form onChange={handleSubmit}>
              <FlexContainer justifyContent="space-between">
                <ItemInputWrapper>
                  <Field
                    as={Input}
                    noMarginOnWrapper
                    name={`${props.item.name}.isPacked`}
                    type="checkbox"
                    checked={values[props.item.name].isPacked}
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
                <IconWrapper onClick={onDelete} style={{ marginRight: 10, visibility: 'hidden' }}>
                  <FaTrash />
                </IconWrapper>
                <IconWrapper
                  onClick={() => navigate(`/app/trips/${props.tripId}/checklist/${props.item.id}`)}
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
