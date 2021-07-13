import { WindowLocation } from '@reach/router';
import { parse, stringify } from 'query-string';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

export const getQueryStringParams = (location: WindowLocation<unknown>) => {
  return parse(location.search);
};

export const mergeQueryParams = (newObj: {}, location: WindowLocation<unknown>) => {
  const existingParams = parse(location.search);
  const newParams = {
    ...existingParams,
    ...newObj,
  };

  return `?${stringify(pickBy(newParams, identity))}`;
};
