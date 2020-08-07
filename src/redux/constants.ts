export const BASE_ROOT = process.env.GATSBY_API_LOCATION;
export const API_VERSION = 'v1';
export const API_ROOT = BASE_ROOT ? `${BASE_ROOT}/api/${API_VERSION}` : '';

// Action Response Type
export type ActionResponseType = {
  error: number;
  payload: {
    status: number;
    [key: string]: any;
    response: {
      errors: {
        [key: string]: string;
      };
      title: string;
      errorCode: string;
    };
  };
  type: string;
};
