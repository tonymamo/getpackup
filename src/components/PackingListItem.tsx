import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FaChevronRight, FaExclamationTriangle } from 'react-icons/fa';
import { navigate } from 'gatsby';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer } from '@styles/size';
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
  padding: ${baseSpacer} ${halfSpacer};

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
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
