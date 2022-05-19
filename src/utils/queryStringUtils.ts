import { WindowLocation } from '@reach/router';
import identity from 'lodash/identity';
import pickBy from 'lodash/pickBy';
import { parse, stringify } from 'query-string';

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
