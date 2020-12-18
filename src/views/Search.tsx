import React, { FunctionComponent } from 'react';

import { Seo, Heading } from '../components';

type SearchProps = {};

const Search: FunctionComponent<SearchProps> = () => {
  return (
    <div>
      <Seo title="Search" />
      <Heading as="h2" altStyle>
        Search
      </Heading>
    </div>
  );
};

export default Search;
