import React, { FC, useState, useEffect } from 'react';
import { Button } from '@components';
import styled from 'styled-components';
import { PackingListItemType } from '@common/packingListItem';
import { baseSpacer } from '@styles/size';
import { FilterListFilterCriteria } from '../enums';

type PackingListFilterProps = {
  list: PackingListItemType[];
  sendFilteredList: (list: PackingListItemType[]) => void;
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
    }
  }
`;

const PackingListFilters: FC<PackingListFilterProps> = ({
  list,
  sendFilteredList,
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialCopyOfList = Object.assign([], list);

  const filterSettings = [
    { id: FilterListFilterCriteria.All },
    { id: FilterListFilterCriteria.Packed },
    { id: FilterListFilterCriteria.Unpacked },
  ];

  const handleFilter = (id: string, index: number) => {
    const isPacked = id === FilterListFilterCriteria.Packed;
    const isAll = id === FilterListFilterCriteria.All;

    if (isAll) {
      sendFilteredList(initialCopyOfList);
    } else {
      const filterList = list.filter((item) => item.isPacked === isPacked);
      sendFilteredList(filterList);
    }
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (list) {
      setTimeout(() => handleFilter(filterSettings[currentIndex].id, currentIndex));
    }
  }, [list]);

  return (
    <Filters>
      <strong>Show:</strong>{' '}
      <FilterButtons>
        {filterSettings.map(({ id }, index) => (
          <Button
            key={id}
            type="button"
            size="small"
            color={index === currentIndex ? 'primary' : 'tertiary'}
            onClick={() => handleFilter(id, index)}
          >
            {id}
          </Button>
        ))}
      </FilterButtons>
    </Filters>
  );
};

export default PackingListFilters;
