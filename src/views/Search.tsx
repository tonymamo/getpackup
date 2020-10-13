import React, { FunctionComponent } from 'react';

import { Seo } from '../components';

type SearchProps = {};

const Search: FunctionComponent<SearchProps> = () => {
  return (
    <div>
      <Seo title="Search" />
    </div>
  );
};

export default Search;
