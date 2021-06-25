/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { FunctionComponent, useState, useMemo } from 'react';
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
import { navigate } from 'gatsby';
import { useLocation, WindowLocation } from '@reach/router';
import Skeleton from 'react-loading-skeleton';

import { quarterSpacer, baseSpacer, baseAndAHalfSpacer } from '@styles/size';
import { baseBorderStyle } from '@styles/mixins';
import { lightestGray, textColorLight, white } from '@styles/color';
import { fontSizeSmall } from '@styles/typography';
import { Column, FlexContainer, Row } from '@components';
import { getQueryStringParams, mergeQueryParams } from '@utils/queryStringUtils';
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
  isLoading?: boolean;
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
  setGlobalFilter,
  searchValue,
  location,
}: {
  setGlobalFilter: any;
  searchValue: string;
  location: WindowLocation<unknown>;
}) => {
  const [value, setValue] = useState(searchValue);
  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val || undefined);
    if (val === '') {
      // if val is blank, clear everything out
      navigate(mergeQueryParams({ currentPage: '', search: '' }, location), { replace: true });
    } else {
      // clear currentPage because there are going to be new results
      navigate(mergeQueryParams({ currentPage: '', search: val }, location), { replace: true });
    }
  }, 200);

  return (
    <InputWrapper>
      <StyledLabel>Search:</StyledLabel>
      <Row>
        <Column xs={8} sm={9} lg={10}>
          <StyledInput
            type="text"
            value={value || ''}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Search anything..."
          />
        </Column>
        <Column xs={4} sm={3} lg={2}>
          <Button
            type="button"
            color="tertiary"
            block
            onClick={() => {
              setValue('');
              onChange('');
            }}
            disabled={!value}
          >
            Clear
          </Button>
        </Column>
      </Row>
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
  isLoading,
}) => {
  const location = useLocation();
  // currentPage index starts at 1 to match displayed text in pagination on UI
  const { search, currentPage, sortColumn, sortDirection } = getQueryStringParams(location);

  const fuzzyTextFilterFn = (rows: Array<{ values: any }>, id: number, filterValue: string) => {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
  };

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: Array<any>, id: number, filterValue: string) => {
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
    state: { pageIndex },
    headerGroups,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: {
        pageSize: rowsPerPage || 10,
        globalFilter: search || '',
        // currentPage index starts at 1 to match displayed text in pagination on UI
        // if no query string for currentPage, set to 0
        pageIndex: currentPage ? Number(currentPage as string) - 1 : 0,
        sortBy: sortColumn
          ? [
              {
                desc: Boolean(sortDirection === 'desc'),
                id: sortColumn ? (sortColumn as string) : '',
              },
            ]
          : [],
      },
      disableMultiSort: true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const pageOrRows = hasPagination ? page : rows;

  return (
    <>
      {hasFiltering && (
        <GlobalFilter
          setGlobalFilter={setGlobalFilter}
          searchValue={search as string}
          location={location}
        />
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
                    <StyledTh
                      key={column.render('header') as string}
                      {...thProps}
                      onClick={() => {
                        let sortDir = '';
                        let sortCol = String(column.render('header')).toLowerCase();
                        let curPage = currentPage ? String(currentPage) : '';
                        if (!sortColumn || !sortDirection || sortDirection === '') {
                          sortDir = 'asc';
                          curPage = '';
                        } else if (sortColumn && sortColumn !== sortCol) {
                          sortDir = 'asc';
                          curPage = '';
                        } else if (
                          sortColumn &&
                          sortColumn === sortCol &&
                          sortDirection === 'asc'
                        ) {
                          sortDir = 'desc';
                        } else if (sortDirection === 'desc') {
                          // reset to blank
                          sortDir = '';
                          sortCol = '';
                          curPage = '';
                        }
                        column.toggleSortBy();
                        navigate(
                          mergeQueryParams(
                            {
                              sortColumn: sortCol,
                              sortDirection: sortDir,
                              currentPage: curPage,
                            },
                            location
                          ),
                          {
                            replace: true,
                          }
                        );
                      }}
                    >
                      {column.render('header')}

                      {hasSorting && (
                        <>
                          {' '}
                          <span>{column.isSorted && column.isSortedDesc && <FaSortAlphaUp />}</span>
                          <span>
                            {column.isSorted && !column.isSortedDesc && <FaSortAlphaDown />}
                          </span>
                          <span>
                            {!column.isSorted && column.canSort && (
                              <FaSort color={textColorLight} />
                            )}
                          </span>
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
          {isLoading ? (
            <>
              {Array.from({ length: rowsPerPage || 10 }).map((_, rowIndex) => (
                <StyledTr key={`loadingTableRow${rowIndex}`}>
                  {Array.from({ length: columns.length }).map((__, cellIndex) => (
                    <StyledTd key={`loadingTableRow${rowIndex}-cell${cellIndex}`}>
                      <Skeleton
                        count={1}
                        // random widths between 40 and 90%
                        width={`${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`}
                        height={baseAndAHalfSpacer}
                      />
                    </StyledTd>
                  ))}
                </StyledTr>
              ))}
            </>
          ) : (
            <>
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
                                          size="small"
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
                                          size="small"
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
            </>
          )}
        </tbody>
      </StyledTable>
      {hasPagination && (
        <>
          {pageOptions.length > 1 && (
            <FlexContainer justifyContent="space-between">
              <div>
                <Button
                  type="button"
                  size="small"
                  rightSpacer
                  color="primaryOutline"
                  onClick={() => {
                    gotoPage(0);
                    // set to empty string to remove currentPage query string param
                    navigate(mergeQueryParams({ currentPage: '' }, location), {
                      replace: true,
                    });
                  }}
                  disabled={!canPreviousPage}
                >
                  <FaAngleDoubleLeft />
                </Button>

                <Button
                  type="button"
                  size="small"
                  color="primaryOutline"
                  onClick={() => {
                    previousPage();
                    navigate(
                      mergeQueryParams(
                        {
                          currentPage:
                            // currentPage index starts at 1 to match displayed text in pagination on UI
                            // if on page 2 and going to page 1, set empty query string for currentPage
                            currentPage === '2' ? '' : String(Number(currentPage as string) - 1),
                        },
                        location
                      ),
                      {
                        replace: true,
                      }
                    );
                  }}
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
                  size="small"
                  rightSpacer
                  onClick={() => {
                    nextPage();
                    navigate(
                      mergeQueryParams(
                        {
                          currentPage:
                            // currentPage index starts at 1 to match displayed text in pagination on UI
                            // if no currentPage, we are on page 1 so go to page 2
                            currentPage ? String(Number(currentPage as string) + 1) : '2',
                        },
                        location
                      ),
                      {
                        replace: true,
                      }
                    );
                  }}
                  disabled={!canNextPage}
                >
                  <FaAngleRight />
                </Button>

                <Button
                  type="button"
                  color="primaryOutline"
                  size="small"
                  onClick={() => {
                    gotoPage(pageCount - 1);
                    navigate(mergeQueryParams({ currentPage: String(pageCount) }, location), {
                      replace: true,
                    });
                  }}
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
