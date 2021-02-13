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
  const [showAddForm, setShowAddForm] = useState(false);
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const handleKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      setShowAddForm(true);
    }
  };

  return (
    <PackingListItemWrapper>
      {showAddForm && (
        <Formik
          validateOnMount
          initialValues={{}}
          onSubmit={async (values, { resetForm }) => {
            try {
              await firebase
                .firestore()
                .collection('trips')
                .doc(tripId)
                .collection('packing-list')
                .add({ ...values, quantity: 1, category: categoryName });

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
                    label="Name"
                    validate={requiredField}
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
      )}
      {!showAddForm && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => setShowAddForm(true)}
        >
          <p>
            <FaPlus /> Add Item...
          </p>
        </div>
      )}
    </PackingListItemWrapper>
  );
};

export default PackingListAddItem;
