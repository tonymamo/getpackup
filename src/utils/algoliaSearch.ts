import algoliasearch from 'algoliasearch/lite';

const algoliaClient = algoliasearch(
  process.env.GATSBY_ENVIRONMENT === 'DEVELOP'
    ? (process.env.GATSBY_TEST_ALGOLIA_APP_ID as string)
    : (process.env.GATSBY_ALGOLIA_APP_ID as string),
  process.env.GATSBY_ENVIRONMENT === 'DEVELOP'
    ? (process.env.GATSBY_TEST_ALGOLIA_SEARCH_API_KEY as string)
    : (process.env.GATSBY_ALGOLIA_SEARCH_API_KEY as string)
);

const alogliaSearch = {
  search(requests: any) {
    if (requests.every(({ params }: any) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

export default alogliaSearch;
