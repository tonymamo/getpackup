import algoliasearch from 'algoliasearch';
import { isAlphaNumeric } from './validations';

const algoliaClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID as string,
  process.env.GATSBY_ALGOLIA_SEARCH_API_KEY as string
);
const searchIndex = algoliaClient.initIndex('Users');

const reservedRouteNamesThatCannotBeUsernames = [
  'about',
  'links',
  'contact',
  'terms',
  'privacy',
  'tags',
  'blog',
  '404',
  'feedback',
  'login',
  'signup',
  'logout',
  'admin',
  'app',
];

const validateUsername = async (value: string, initialValue: string) => {
  if (value === '' || value === initialValue) {
    // return out early to avoid api calls below
    return undefined;
  }

  if (value.length < 3) {
    return 'Username must be at least 3 characters long';
  }

  if (isAlphaNumeric(value) !== undefined) {
    return 'Username can only contain letters and numbers';
  }

  const searchValue = value.toLowerCase();

  const response = await searchIndex.search(searchValue, {
    restrictSearchableAttributes: ['username'],
    typoTolerance: false,
    filters: `username:${searchValue}`,
  });

  let error;
  if (reservedRouteNamesThatCannotBeUsernames.includes(searchValue) || response.nbHits !== 0) {
    error = `Sorry, ${value} is unavailable`;
  }
  return error;
};

export default validateUsername;
