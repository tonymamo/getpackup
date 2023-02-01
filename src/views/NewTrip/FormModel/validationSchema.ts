import * as Yup from 'yup';

import newTripFormModel from './newTripFormModel';

const {
  formField: { name, startDate, endDate, lat, lng },
} = newTripFormModel;

export default [
  Yup.object().shape({
    [lat.name]: Yup.string().required(lat.requiredErrorMsg),
    [lng.name]: Yup.string().required(lng.requiredErrorMsg),
  }),
  Yup.object().shape({
    [startDate.name]: Yup.string().required(startDate.requiredErrorMsg),
    [endDate.name]: Yup.string().required(endDate.requiredErrorMsg),
  }),
  {}, // Third step is to add trip members which is not required
  Yup.object().shape({
    [name.name]: Yup.string().required(name.requiredErrorMsg),
  }),
  {}, // Fifth step is to add header image which is not required
];
