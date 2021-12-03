import React, { FC, useState } from 'react';
import { Button } from '@components';
import { FaSlidersH } from 'react-icons/fa';
import styled from 'styled-components';
import { PackingListItemType } from '@common/packingListItem';
import { baseSpacer, borderRadius } from '@styles/size';
import { FilterListFilterCriteria } from '../enums';

type PackingListFilterProps = {
  list: PackingListItemType[];
  sendFilteredList: (list: PackingListItemType[]) => void;
};

const Filters = styled.div`
  margin-bottom: ${baseSpacer};
`;

const FilterButtons = styled.div`
  border-radius: ${borderRadius};

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
  const [packingListToFilter] = useState<PackingListItemType[]>(list ?? []);

  const initialCopyOfList = Object.assign([], list);

  const filterSettings = [
    { id: FilterListFilterCriteria.All },
    { id: FilterListFilterCriteria.Packed },
    { id: FilterListFilterCriteria.Unpacked },
  ];

  const handleFilter = (id: string, index: number) => {
    const isPacked = id === FilterListFilterCriteria.Packed;
    const isAll = id === FilterListFilterCriteria.All;
    let newList: PackingListItemType[] = [];

    if (isAll) {
      newList = initialCopyOfList;
    } else {
      newList = packingListToFilter.filter((item) => item.isPacked === isPacked);
    }
    setCurrentIndex(index);
    sendFilteredList(newList);
  };

  return (
    <Filters>
      <FaSlidersH /> <strong>Filter by:</strong>
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
