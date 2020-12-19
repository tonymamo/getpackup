import React, { FunctionComponent } from 'react';

import { Seo, Heading } from '@components';

type ShoppingListProps = {};

const ShoppingList: FunctionComponent<ShoppingListProps> = () => {
  return (
    <div>
      <Seo title="Shopping List" />
      <Heading as="h2" altStyle>
        Shopping List
      </Heading>
    </div>
  );
};

export default ShoppingList;
