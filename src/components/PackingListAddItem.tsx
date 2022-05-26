import { FlexContainer, Input } from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { brandPrimary, offWhite, textColor } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { doubleSpacer, halfSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import { Field, Form, Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { InputWrapper } from './Input';

type PackingListItemProps = {
  tripId: string;
  categoryName: string;
  isOnSharedList?: boolean;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  padding: ${halfSpacer};
  &:hover {
    background-color: ${offWhite};
  }

  & ${InputWrapper} {
    margin-bottom: 0;
    flex: 1;
  }
`;

const IconWrapper = styled.div`
  cursor: pointer;
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${textColor};
  &:hover {
    color: ${brandPrimary};
  }
`;

const PackingListAddItem: FunctionComponent<PackingListItemProps> = ({
  tripId,
  categoryName,
  isOnSharedList,
}) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{
          [`new-${categoryName}`]: '',
          category: categoryName,
          quantity: 1,
          isPacked: false,
          isEssential: false,
          description: '',
          created: new Date(),
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          resetForm({});
          if ((values[`new-${categoryName}`] as string).length > 1) {
            try {
              await firebase
                .firestore()
                .collection('trips')
                .doc(tripId)
                .collection('packing-list')
                .add({
                  name: values[`new-${categoryName}`],
                  category: categoryName,
                  quantity: 1,
                  isPacked: false,
                  isEssential: false,
                  description: '',
                  created: new Date(),
                  packedBy: [
                    {
                      isShared: isOnSharedList,
                      quantity: 1,
                      uid: auth.uid,
                    },
                  ],
                });
              trackEvent('Packing List Item Added', {
                name: values[`new-${categoryName}`],
                categoryName,
                tripId,
              });
              setSubmitting(false);
            } catch (err) {
              setSubmitting(false);
              trackEvent('Packing List Item Add Failure', {
                name: values[`new-${categoryName}`],
                categoryName,
                tripId,
                error: err,
              });
              await dispatch(
                addAlert({
                  type: 'danger',
                  message: 'Faled to add item, please try again',
                })
              );
            }
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <FlexContainer justifyContent="flex-start">
              <Field
                as={Input}
                type="text"
                name={`new-${categoryName}`}
                label="Add Item"
                hiddenLabel
                disabled={isSubmitting}
              />
              <IconWrapper onClick={() => handleSubmit()} data-tip="Add Item" data-for="addItem">
                <FaPlus />
                <ReactTooltip
                  id="addItem"
                  place="top"
                  type="dark"
                  effect="solid"
                  className="tooltip customTooltip"
                />
              </IconWrapper>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListAddItem;
