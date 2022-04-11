import React, { FunctionComponent } from 'react';
import { Button } from '@components';
import styled from 'styled-components';
import { navigate } from '@reach/router';

import { baseSpacer } from '@styles/size';
import { PackingListFilterOptions } from '@utils/enums';
import { mergeQueryParams } from '@utils/queryStringUtils';

type PackingListFilterProps = {
  disabled: boolean;
  activeFilter: PackingListFilterOptions;
  onFilterChange: (filter: PackingListFilterOptions) => void;
  location: any;
};

const Filters = styled.div`
  margin-bottom: ${baseSpacer};
`;

const FilterButtons = styled.div`
  display: inline-flex;
  & button {
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &:nth-child(2) {
      border-radius: 0;
      border-left-width: 0;
      border-right-width: 0;
    }
  }
`;

const PackingListFilters: FunctionComponent<PackingListFilterProps> = ({
  disabled,
  activeFilter,
  onFilterChange,
  location,
}): JSX.Element => {
  const filterSettings = [
    PackingListFilterOptions.All,
    PackingListFilterOptions.Packed,
    PackingListFilterOptions.Unpacked,
  ];

  const handleFilter = (filter: PackingListFilterOptions) => {
    onFilterChange(filter);
    navigate(mergeQueryParams({ filter }, location), {
      replace: true,
    });
  };

  return (
    <Filters>
      <strong>Show: </strong>
      <FilterButtons>
        {filterSettings.map((filter) => (
          <Button
            key={filter}
            type="button"
            size="small"
            color={filter === activeFilter ? 'primary' : 'tertiary'}
            onClick={() => handleFilter(filter)}
            disabled={disabled}
          >
            {filter}
          </Button>
        ))}
      </FilterButtons>
    </Filters>
  );
};

export default PackingListFilters;
