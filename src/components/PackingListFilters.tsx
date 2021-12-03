import React, { FC, useState, CSSProperties } from "react";
import { Button } from "@components";
import { FaSlidersH } from 'react-icons/fa';
import styled from 'styled-components';
import {
  lightGray,
  white,
  darkGray,
  brandPrimary,
} from '@styles/color';
import { FilterListFilterCriteria } from "../enums";
import { PackingListItemType } from "@common/packingListItem";

type PackingListFilterProps = {
  list: PackingListItemType[];
  sendFilteredList: (list: PackingListItemType[]) => void;
};

const Filters = styled.div`
  margin-bottom: 20px;
  
  span {
    font-size: 14px;
    font-weight: 700;
    margin-left: 8px;
    vertical-align: top;
  }
`;

const FilterButtons = styled.div`
  background-color: ${lightGray};
  border-radius: 5px;
  display: flex;
  padding: 5px;
  width: fit-content;

  button {
    background-color: ${white};
    color: ${darkGray};
    font-size: 16px;
    margin: 0;
    margin-right: 2px;
    padding-left: 8px;
    padding-right: 8px;

    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      margin-right: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &:nth-child(2) {
      border-radius: 0;
    }
  }
`;

const PackingListFilters: FC<PackingListFilterProps> = ({ list, sendFilteredList }): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [packingListToFilter] = useState<PackingListItemType[]>(list ?? []);

  const initialCopyOfList = Object.assign([], list);

  const activeButtonStyle = (index: number): CSSProperties => ({
    backgroundColor: currentIndex === index ? brandPrimary : white,
    color: currentIndex === index ? white : 'inherit',
  });

  const filterSettings = [
    { id: FilterListFilterCriteria.All },
    { id: FilterListFilterCriteria.Packed },
    { id: FilterListFilterCriteria.Unpacked }
  ];

  const handleFilter = (id: string, index: number) => {
    const isPacked = id === FilterListFilterCriteria.Packed;
    const isAll = id === FilterListFilterCriteria.All;
    let newList: PackingListItemType[] = [];

    if (isAll) {
      newList = initialCopyOfList;
    } else {
      newList = packingListToFilter.filter(
        (item => item.isPacked === isPacked)
      );
    }
    setCurrentIndex(index);
    sendFilteredList(newList);
  };

  return (
    <Filters>
      <FaSlidersH /><span>Filter by:</span>
      <FilterButtons>
        {filterSettings.map(({ id }, index) =>
          <Button 
            key={id} 
            type="button" 
            size="small" 
            onClick={() => handleFilter(id, index)}
            style={activeButtonStyle(index)}
          >{id}</Button>
        )}
      </FilterButtons>
    </Filters>
  );
};

export default PackingListFilters;
