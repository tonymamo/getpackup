/* eslint-disable no-nested-ternary */
import React, { FunctionComponent } from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { matchSorter } from 'match-sorter';
import styled from 'styled-components';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from 'react-icons/fa';

import { quarterSpacer, baseSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { lightestGray, textColorLight, white } from '@styles/color';
import { fontSizeSmall } from '@styles/typography';
import { Column, FlexContainer, Row } from '@components';
import Button, { ButtonProps } from './Button';
import { StyledInput, StyledLabel, InputWrapper } from './Input';

type TableActionType = {
  to?: string;
  label: string;
  icon: JSX.Element;
  color: ButtonProps['color'];
  onClick?: () => void;
};

type TableProps = {
  columns: Array<{
    header: string;
    accessor: string;
  }>;
  data: Array<any>;
  actions?: Array<TableActionType>;
  hasPagination?: boolean;
  hasSorting?: boolean;
  hasFiltering?: boolean;
  rowsPerPage?: number;
};

const StyledTable = styled.table`
  margin-bottom: ${baseSpacer};
  width: 100%;
  font-size: ${fontSizeSmall};
`;

const StyledTr = styled.tr`
  border: ${baseBorderStyle};
  &:hover {
    background-color: ${white};
  }
`;

const StyledTd = styled.td`
  padding: ${quarterSpacer};
  border: ${baseBorderStyle};
`;

const StyledTh = styled.th`
  padding: ${quarterSpacer};
  font-weight: bold;
  border: ${baseBorderStyle};
  background-color: ${lightestGray};
`;

const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: any;
  setGlobalFilter: any;
}) => {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
  }, 200);

  return (
    <InputWrapper>
      <StyledLabel>Search:</StyledLabel>
      <StyledInput
        type="text"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search anything..."
      />
    </InputWrapper>
  );
};

const Table: FunctionComponent<TableProps> = ({
  columns,
  data,
  hasPagination,
  hasSorting,
  hasFiltering,
  rowsPerPage,
}) => {
  const fuzzyTextFilterFn = (rows: any, id: any, filterValue: string) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    page,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, globalFilter },
    headerGroups,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageSize: rowsPerPage || 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const pageOrRows = hasPagination ? page : rows;

  return (
    <>
      {hasFiltering && (
        <Row>
          <Column md={4}>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </Column>
        </Row>
      )}
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const headerGroupProps = headerGroup.getHeaderGroupProps();
            return (
              <StyledTr {...headerGroupProps} key={headerGroupProps.key}>
                {headerGroup.headers.map((column) => {
                  const thProps = hasSorting
                    ? column.getHeaderProps(column.getSortByToggleProps())
                    : {};
                  return (
                    <StyledTh key={column.header} {...thProps}>
                      {column.header}
                      {hasSorting && (
                        <>
                          {' '}
                          <span>{column.isSorted && column.isSortedDesc && <FaSortAlphaUp />}</span>
                          <span>
                            {column.isSorted && !column.isSortedDesc && <FaSortAlphaDown />}
                          </span>
                          <span>{!column.isSorted && <FaSort color={textColorLight} />}</span>
                        </>
                      )}
                    </StyledTh>
                  );
                })}
              </StyledTr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {pageOrRows.map((row) => {
            prepareRow(row);
            return (
              <StyledTr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => {
                  // if cell.
                  return (
                    <StyledTd {...cell.getCellProps()} key={cell.getCellProps().key}>
                      {String(cell.getCellProps().key).includes('action') ? (
                        <>
                          {cell.row.original.actions &&
                            cell.row.original.actions.length > 0 &&
                            cell.row.original.actions.map(
                              (action: TableActionType, index: number) => {
                                if (action.onClick) {
                                  return (
                                    <Button
                                      type="button"
                                      key={`${cell.row.id}-${action.color}`}
                                      onClick={action.onClick}
                                      color={action.color ?? 'text'}
                                      iconLeft={action.icon}
                                      rightSpacer={
                                        cell.row.original.actions.length > 1 &&
                                        index !== cell.row.original.actions.length - 1
                                      }
                                    >
                                      {action.label}
                                    </Button>
                                  );
                                }
                                if (action.to) {
                                  // TODO: more styling options like icon only button, colored button
                                  return (
                                    <Button
                                      type="link"
                                      key={`${cell.row.id}-${action.to}`}
                                      to={action.to}
                                      color={action.color || 'text'}
                                      iconLeft={action.icon}
                                      rightSpacer={
                                        cell.row.original.actions.length > 1 &&
                                        index !== cell.row.original.actions.length - 1
                                      }
                                    >
                                      {action.label}
                                    </Button>
                                  );
                                }
                                return null;
                              }
                            )}
                        </>
                      ) : (
                        cell.value
                      )}
                    </StyledTd>
                  );
                })}
              </StyledTr>
            );
          })}
        </tbody>
      </StyledTable>
      {hasPagination && (
        <>
          {pageOptions.length > 1 && (
            <FlexContainer justifyContent="space-between">
              <div>
                <Button
                  type="button"
                  color="primaryOutline"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <FaAngleDoubleLeft />
                </Button>

                <Button
                  type="button"
                  color="primaryOutline"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <FaAngleLeft />
                </Button>
              </div>
              <small>
                Page {pageIndex + 1} of {pageOptions.length}
              </small>
              <div>
                <Button
                  type="button"
                  color="primaryOutline"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <FaAngleRight />
                </Button>

                <Button
                  type="button"
                  color="primaryOutline"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <FaAngleDoubleRight />
                </Button>
              </div>
            </FlexContainer>
          )}
          <p>&nbsp;</p>
        </>
      )}
    </>
  );
};

export default Table;
