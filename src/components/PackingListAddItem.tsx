import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer, IconWrapper } from '@components';
import { offWhite } from '@styles/color';
import { FaPlus } from 'react-icons/fa';
import { requiredField } from '@utils/validations';

type PackingListItemProps = {
  tripId: string;
  categoryName: string;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  padding: ${baseSpacer} ${halfSpacer} 0;
  margin: 0 -${halfSpacer};

  &:hover {
    background-color: ${offWhite};
  }
`;

const PackingListAddItem: FunctionComponent<PackingListItemProps> = ({ tripId, categoryName }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        onSubmit={async ({ name }: { name: string }, { resetForm }) => {
          try {
            await firebase
              .firestore()
              .collection('trips')
              .doc(tripId)
              .collection('packing-list')
              .add({
                name,
                category: categoryName,
                quantity: 1,
                isPacked: false,
                isEssential: false,
                description: '',
              });

            resetForm({});
          } catch (err) {
            await dispatch(
              addAlert({
                type: 'danger',
                message: err.message,
              })
            );
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FlexContainer justifyContent="space-between">
              <FlexContainer justifyContent="space-between" flexDirection="column">
                <Field
                  as={Input}
                  type="text"
                  name="name"
                  label="Add Item"
                  validate={requiredField}
                  hiddenLabel
                  required
                />
              </FlexContainer>
              <IconWrapper onClick={handleSubmit}>
                <FaPlus />
              </IconWrapper>
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListAddItem;
