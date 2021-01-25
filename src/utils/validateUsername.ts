import { ExtendedFirebaseInstance } from 'react-redux-firebase';

const validateUsername = async (
  value: string,
  firebase: ExtendedFirebaseInstance,
  loggedInUserUID: string
) => {
  if (value === '') {
    // return out early to avoid api calls below
    return undefined;
  }

  if (value.length < 3) {
    return 'Username must be at least 3 characters long';
  }

  const searchValue = value.toLowerCase();

  const response = await firebase
    .firestore()
    .collection('users')
    .orderBy(`searchableIndex.${searchValue}`)
    .limit(5)
    .get();
  const existingUsernames: Array<any> = [];

  if (!response.empty) {
    response.forEach((doc) => existingUsernames.push(doc.data()));
  }

  let error;
  if (
    existingUsernames.filter((user) => user.uid !== loggedInUserUID && user.username === value)
      .length > 0
  ) {
    error = `Sorry, ${value} is unavailable`;
  }
  return error;
};

export default validateUsername;
