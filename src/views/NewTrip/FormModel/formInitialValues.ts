import { TripFormType } from 'common/trip';

/*
 * This function is used to initialize the form values
 */
const getInitValues = (ownerId: string): TripFormType => {
  return {
    owner: ownerId,
    tripId: '',
    name: '',
    description: '',
    startingPoint: '',
    season: undefined,
    startDate: new Date(),
    endDate: new Date(),
    timezoneOffset: new Date().getTimezoneOffset(),
    lat: 0,
    lng: 0,
    created: undefined,
    updated: undefined,
    tripMembers: {},
    tags: [],
    tripLength: 0,
    headerImage: '',
    archived: false,
    collapsedCategories: {},
  };
};

export default getInitValues;
