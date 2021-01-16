import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import Input from './Input';

type PackingListItemProps = {
  id: string;
  isPacked: boolean;
  name: string;
  category: string;
  tripId: string;
};

const PackingListItemWrapper = styled.div`
  border-bottom: ${baseBorderStyle};
  padding-top: ${baseSpacer};
`;

const PackingListItem: FunctionComponent<PackingListItemProps> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  return (
    <PackingListItemWrapper>
      <Formik
        validateOnMount
        initialValues={{ [props.name]: { isPacked: props.isPacked } }}
        onSubmit={(values, { resetForm }) => {
          firebase
            .firestore()
            .collection('trips')
            .doc(props.tripId)
            .collection('packing-list')
            .doc(props.id)
            .update({
              isPacked: values[props.name].isPacked,
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
            <Field
              as={Input}
              name={`${props.name}.isPacked`}
              type="checkbox"
              checked={values[props.name].isPacked}
              label={props.name}
            />
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
