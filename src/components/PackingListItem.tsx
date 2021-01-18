import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from 'styled-components';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { FaExclamationTriangle } from 'react-icons/fa';

import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer } from '@styles/size';
import { addAlert } from '@redux/ducks/globalAlerts';
import { Input, FlexContainer } from '@components';
import { brandDanger } from '@styles/color';

type PackingListItemProps = {
  id: string;
  isPacked: boolean;
  name: string;
  category: string;
  tripId: string;
  isEssential: boolean;
};

const PackingListItemWrapper = styled.div`
  border-bottom: ${baseBorderStyle};
  padding-top: ${baseSpacer};
`;

const TooltipWrapper = styled.div`
  /* margin bottom to match Input's margin */
  margin-bottom: ${baseSpacer};
  margin-left: ${halfSpacer};
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
            <FlexContainer justifyContent="flex-start">
              <Field
                as={Input}
                name={`${props.name}.isPacked`}
                type="checkbox"
                checked={values[props.name].isPacked}
                label={props.name}
              />
              {props.isEssential && (
                <TooltipWrapper>
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
                </TooltipWrapper>
              )}
            </FlexContainer>
          </Form>
        )}
      </Formik>
    </PackingListItemWrapper>
  );
};

export default PackingListItem;
