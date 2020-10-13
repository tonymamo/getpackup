import React, { FunctionComponent } from 'react';

import { Seo } from '../components';

type ShoppingListProps = {};

const ShoppingList: FunctionComponent<ShoppingListProps> = () => {
  return (
    <div>
      <Seo title="Shopping List" />
    </div>
  );
};

export default ShoppingList;
