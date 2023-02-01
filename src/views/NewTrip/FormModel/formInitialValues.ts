import newTripFormModel from './newTripFormModel';

const {
  formField: {
    name,
    startDate,
    endDate,
    description,
    owner,
    tripId,
    startingPoint,
    timezoneOffset,
    tripLength,
    season,
    lat,
    lng,
    tripMembers,
    headerImage,
  },
} = newTripFormModel;

/*
 * This function is used to initialize the form values
 */
const getInitValues = (ownerId: string) => {
  return {
    [name.name]: '',
    [startDate.name]: '',
    [endDate.name]: '',
    [description.name]: '',
    [owner.name]: ownerId,
    [tripId.name]: '',
    [startingPoint.name]: '',
    [timezoneOffset.name]: new Date().getTimezoneOffset(),
    [tripLength.name]: '',
    [season.name]: '',
    [lat.name]: '',
    [lng.name]: '',
    [tripMembers.name]: [],
    [headerImage.name]: '',
  };
};

export default getInitValues;
