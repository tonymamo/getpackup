import React, { FunctionComponent } from 'react';

import { Seo, Heading, PageContainer, Box } from '@components';

type SearchProps = {};

const Search: FunctionComponent<SearchProps> = () => {
  return (
    <PageContainer>
      <Seo title="Search" />
      <Heading as="h2" altStyle>
        Search
      </Heading>
      <Box>Coming Soon!</Box>
    </PageContainer>
  );
};

export default Search;
