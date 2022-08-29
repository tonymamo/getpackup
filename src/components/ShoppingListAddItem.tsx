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

type ShoppingListItemProps = {};

const ShoppingListItemWrapper = styled.li`
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

const ShoppingListAddItem: FunctionComponent<ShoppingListItemProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  // isChecked: boolean;
  //   created: firebase.default.firestore.Timestamp;
  //   id: string;
  //   name: string;
  //   quantity: number;
  //   updated?: firebase.default.firestore.Timestamp;

  return (
    <ShoppingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{
          created: new Date(),
          isChecked: false,
          name: '',
          quantity: 1,
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          resetForm({});
          if (values.name.length > 1) {
            try {
              await firebase
                .firestore()
                .collection('shopping-list')
                .doc(auth.uid)
                .collection('items')
                .add({
                  created: new Date(),
                  isChecked: false,
                  name: values.name,
                  quantity: 1,
                });
              trackEvent('Shopping List Item Added', values);
              setSubmitting(false);
            } catch (err) {
              setSubmitting(false);
              trackEvent('Shopping List Item Add Failure', {
                ...values,
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
                name="name"
                label="Add Item"
                hiddenLabel
                disabled={isSubmitting}
                maxLength={64}
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
    </ShoppingListItemWrapper>
  );
};

export default ShoppingListAddItem;
