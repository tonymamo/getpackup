import React, { FunctionComponent } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import 'instantsearch.css/themes/reset.css';
import 'instantsearch.css/themes/satellite.css';

import { Seo, Heading, PageContainer, Box, UserMediaObject, Button } from '@components';
import { UserType } from '@common/user';

type SearchProps = {};

const Search: FunctionComponent<SearchProps> = () => {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID as string,
    process.env.GATSBY_ALGOLIA_SEARCH_API_KEY as string
  );

  const Hit = ({ hit }: { hit: UserType }) => (
    <UserMediaObject
      user={hit}
      avatarSize="md"
      showSecondaryContent
      action={
        <Button type="link" to={`/${hit.username}`} color="primaryOutline">
          View Profile
        </Button>
      }
    />
  );

  return (
    <PageContainer>
      <Seo title="Search" />
      <Heading as="h2" altStyle>
        Search
      </Heading>
      <Box>
        <InstantSearch searchClient={searchClient} indexName="Users">
          <SearchBox showLoadingIndicator />
          <Hits hitComponent={Hit} />
        </InstantSearch>
      </Box>
    </PageContainer>
  );
};

export default Search;
