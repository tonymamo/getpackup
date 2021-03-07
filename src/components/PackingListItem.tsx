import React, { FunctionComponent } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';
import { navigate } from 'gatsby';
import {
  LeadingActions,
  SwipeableList,
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

type PackingListItemProps = {
  tripId: string;
  item: PackingListItemType;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  padding: ${halfSpacer};

  &:hover {
    background-color: ${offWhite};
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

const trailingActions = ({ id }) => (
  <TrailingActions>
    <SwipeAction destructive onClick={() => console.log(id)}>
      Delete
    </SwipeAction>
  </TrailingActions>
);

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const onSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    firebase
      .firestore()
      .collection('trips')
      .doc(props.tripId)
      .collection('packing-list')
      .doc(props.item.id)
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

  return (
    <PackingListItemWrapper>
      <SwipeableListItem
        listType={ListType.IOS}
        trailingActions={trailingActions({ id: props.item.id })}
        onSwipeEnd={() => {
          console.log('end');
        }}
        onSwipeProgress={() => {
          console.log('progress');
        }}
        onSwipeStart={() => {
          console.log('start');
        }}
      >
        <Formik<FormValues>
          validateOnMount
          initialValues={{ [props.item.name]: { isPacked: props.item.isPacked } }}
          onSubmit={onSubmit}
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
                      {props.item.name} <Pill text={`× ${props.item.quantity}`} color="neutral" />
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
