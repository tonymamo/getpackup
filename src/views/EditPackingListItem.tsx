import React, { FunctionComponent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';

import { Button, FlexContainer, Heading, Input } from '@components';
import { PackingListItemType } from '@common/packingListItem';
import { requiredField, requiredSelect } from '@utils/validations';
import { gearListCategories } from '@utils/gearListItemEnum';
import { doubleSpacer } from '@styles/size';
import { darkGray } from '@styles/color';

type EditPackingListItemProps = {
  activeItem?: PackingListItemType;
  backToPackingListClick: () => void;
  setActivePackingListItem: (value: undefined) => void;
};

const EditPackingListItem: FunctionComponent<EditPackingListItemProps> = (props) => {
  return (
    <div>
      <FlexContainer justifyContent="flex-end">
        <Button
          type="button"
          onClick={() => {
            props.setActivePackingListItem(undefined);
            props.backToPackingListClick();
          }}
          color="text"
        >
          <FaTimes size={doubleSpacer} color={darkGray} />
        </Button>
      </FlexContainer>
      {props.activeItem ? (
        <Formik
          validateOnMount
          initialValues={{
            ...props.activeItem,
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid, values, setFieldValue, ...rest }) => (
            <Form>
              <Heading altStyle as="h2">
                {values.name}
              </Heading>
              <Field
                as={Input}
                type="text"
                name="name"
                label="Name"
                validate={requiredField}
                required
              />
              <Field as={Input} type="textarea" name="description" label="Description" />
              <Field as={Input} type="number" name="quantity" label="Quantity" />
              <Field
                as={Input}
                type="select"
                name="category"
                label="Category"
                options={gearListCategories}
                validate={requiredSelect}
                setFieldValue={setFieldValue}
                {...rest}
                required
              />
            </Form>
          )}
        </Formik>
      ) : (
        <FlexContainer height="30vh">
          <p>Select an item to edit</p>
        </FlexContainer>
      )}
    </div>
  );
};

export default EditPackingListItem;
