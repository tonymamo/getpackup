import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import { baseBorderStyle } from '@styles/mixins';
import { halfSpacer, doubleSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer } from '@components';
import { brandPrimary, offWhite, textColor } from '@styles/color';
import trackEvent from '@utils/trackEvent';
import { InputWrapper } from './Input';

type PackingListItemProps = {
  tripId: string;
  categoryName: string;
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

const PackingListAddItem: FunctionComponent<PackingListItemProps> = ({ tripId, categoryName }) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

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
                  message: err.message,
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
              <IconWrapper onClick={() => handleSubmit()}>
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
