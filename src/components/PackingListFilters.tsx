import { Button } from '@components';
import { baseSpacer } from '@styles/size';
import { PackingListFilterOptions } from '@utils/enums';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

type PackingListFilterProps = {
  disabled: boolean;
  activeFilter: PackingListFilterOptions;
  onFilterChange: (filter: PackingListFilterOptions) => void;
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
}): JSX.Element => {
  const filterSettings = [
    PackingListFilterOptions.All,
    PackingListFilterOptions.Packed,
    PackingListFilterOptions.Unpacked,
  ];

  const dispatch = useDispatch();

  const handleFilter = (filter: PackingListFilterOptions) => {
    dispatch(onFilterChange(filter));
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
