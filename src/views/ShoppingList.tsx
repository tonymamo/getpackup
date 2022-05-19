import { Box, Heading, PageContainer, Seo } from '@components';
import React, { FunctionComponent } from 'react';

type ShoppingListProps = {};

const ShoppingList: FunctionComponent<ShoppingListProps> = () => {
  return (
    <PageContainer>
      <Seo title="Shopping List" />
      <Heading as="h2" altStyle>
        Shopping List
      </Heading>
      <Box>Coming Soon!</Box>
    </PageContainer>
  );
};

export default ShoppingList;
