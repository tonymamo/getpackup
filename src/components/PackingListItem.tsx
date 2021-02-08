import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer, Pill } from '@components';
import { brandDanger, brandPrimary, offWhite } from '@styles/color';
import { PackingListItemType } from '@common/packingListItem';

type PackingListItemProps = {
  tripId: string;
  item: PackingListItemType;
  editPackingItemClick: () => void;
  setActivePackingListItem: (value: PackingListItemType) => void;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  padding: ${baseSpacer} ${halfSpacer} 0;
  margin: 0 -${halfSpacer};

  &:hover {
    background-color: ${offWhite};
  }
`;

const ItemInputWrapper = styled.div`
  flex: 1;
`;

const IconWrapper = styled.div`
  /* margin bottom to match Input's margin */
  margin-bottom: ${baseSpacer};
  margin-left: ${baseSpacer};
  cursor: pointer;
  &:hover {
    color: ${brandPrimary};
  }
`;

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{ [props.item.name]: { isPacked: props.item.isPacked } }}
        onSubmit={(values, { resetForm }) => {
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
        }}
      >
        {({ values, handleSubmit }) => (
          <Form onChange={handleSubmit}>
            <FlexContainer justifyContent="space-between">
              <ItemInputWrapper>
                <Field
                  as={Input}
                  name={`${props.item.name}.isPacked`}
                  type="checkbox"
                  checked={values[props.item.name].isPacked}
                  label={
                    props.item.quantity && props.item.quantity !== 1 ? (
                      <>
                        {props.item.name} <Pill text={`× ${props.item.quantity}`} color="neutral" />
                      </>
                    ) : (
                      props.item.name
                    )
                  }
                />
              </ItemInputWrapper>

              {props.item.isEssential && (
                <IconWrapper>
                  <FaExclamationTriangle
                    data-tip="This is an essential item"
                    data-for="essentialItem"
                    color={brandDanger}
                  />
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
                onClick={() => {
                  props.setActivePackingListItem(props.item);
                  props.editPackingItemClick();
                }}
              >
                <FaChevronRight />
              </IconWrapper>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
