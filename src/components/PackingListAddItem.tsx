import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';

import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer, quarterSpacer, threeQuarterSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer } from '@components';
import { offWhite, textColorLight } from '@styles/color';
import { FaPlus } from 'react-icons/fa';
import { InputWrapper } from './Input';

type PackingListItemProps = {
  tripId: string;
  categoryName: string;
};

const PackingListItemWrapper = styled.li`
  border-bottom: ${baseBorderStyle};
  padding: ${halfSpacer};
  margin: 0 -${halfSpacer};
  &:hover {
    background-color: ${offWhite};
  }

  & ${InputWrapper} {
    margin-bottom: 0;
    flex: 1;
  }
`;

const IconWrapper = styled.div`
  margin: 0 ${threeQuarterSpacer} 0 ${quarterSpacer};
  color: ${textColorLight};
`;

const PackingListAddItem: FunctionComponent<PackingListItemProps> = ({ tripId, categoryName }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{
          name: '',
          category: categoryName,
          quantity: 1,
          isPacked: false,
          isEssential: false,
          description: '',
          created: new Date(),
        }}
        onSubmit={async (values, { resetForm }) => {
          if (values.name.length > 1) {
            try {
              await firebase
                .firestore()
                .collection('trips')
                .doc(tripId)
                .collection('packing-list')
                .add(values);

              resetForm({});
            } catch (err) {
              await dispatch(
                addAlert({
                  type: 'danger',
                  message: err.message,
                })
              );
            }
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FlexContainer justifyContent="flex-start">
              <IconWrapper>
                <FaPlus />
              </IconWrapper>
              <Field as={Input} type="text" name="name" label="Add Item" hiddenLabel />
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListAddItem;
