import { ActivityTypes, GearListEnumType } from '@common/gearItem';
import { Column, FlexContainer, IconWrapper, Row } from '@components';
import Button, { ButtonProps } from '@components/Button';
import { InputWrapper, StyledInput, StyledLabel, multiSelectStyles } from '@components/Input';
import { WindowLocation, useLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { brandDanger, brandPrimary, lightestGray, textColorLight, white } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import {
  baseAndAHalfSpacer,
  baseSpacer,
  doubleSpacer,
  halfSpacer,
  quarterSpacer,
} from '@styles/size';
import { fontSizeSmall } from '@styles/typography';
import { createOptionsFromGearListArray } from '@utils/createOptionsFromArray';
import {
  allGearListItems,
  gearListAccommodations,
  gearListActivities,
  gearListCampKitchen,
  gearListOtherConsiderations,
} from '@utils/gearListItemEnum';
import { getQueryStringParams, mergeQueryParams } from '@utils/queryStringUtils';
import useWindowSize from '@utils/useWindowSize';
import { navigate } from 'gatsby';
import uniqBy from 'lodash/uniqBy';
import { matchSorter } from 'match-sorter';
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { FunctionComponent, useMemo, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaChevronRight,
  FaPencilAlt,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaTrash,
} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';

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
  border: none;
  table-layout: fixed;
`;

const StyledTr = styled.tr`
  border-bottom: ${baseBorderStyle};
  &:hover {
    background-color: ${white};
  }

  &:hover svg {
    visibility: visible;
  }
`;

const StyledTd = styled.td`
  padding: ${halfSpacer} ${quarterSpacer};
  border: none;
`;

const StyledTh = styled.th`
  padding: ${halfSpacer} ${quarterSpacer};
  font-weight: bold;
  border: ${baseBorderStyle};
  background-color: ${lightestGray};
  text-transform: uppercase;
`;

const GlobalFilter = ({
  setGlobalFilter,
  setValueToSearch,
  valueToSearch,
  setTagToSearch,
  tagToSearch,
  location,
}: {
  setGlobalFilter: (value: string) => void;
  setValueToSearch: (value: string) => void;
  valueToSearch: string;
  setTagToSearch: (value: string) => void;
  tagToSearch: string;
  location: WindowLocation<unknown>;
}) => {
  const size = useWindowSize();
  const fetchedGearCloset = useSelector((state: RootState) => state.firestore.ordered.gearCloset);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  const gearClosetCategories: Array<keyof ActivityTypes> = fetchedGearCloset?.[0]?.categories ?? [];

  const onChange = useAsyncDebounce(({ val, subCat }: { val: string; subCat: string }) => {
    setGlobalFilter(val || subCat || '');
    if (val === '' || subCat === '') {
      setGlobalFilter('');
      // if val is blank, clear everything out
      navigate(mergeQueryParams({ currentPage: '', search: '', tag: '' }, location), {
        replace: true,
      });
    }
    if (val !== '') {
      setGlobalFilter(val);
      // clear currentPage because there are going to be new results
      navigate(mergeQueryParams({ currentPage: '', search: val || '', tag: '' }, location), {
        replace: true,
      });
    }
    if (subCat !== '') {
      setGlobalFilter(`subCat-${subCat}`);
      // clear currentPage because there are going to be new results
      navigate(mergeQueryParams({ currentPage: '', search: '', tag: subCat }, location), {
        replace: true,
      });
    }
  }, 200);

  // the categories that the user DOES have in their gear closet, so we can only show those
  const getFilteredCategories = (array: GearListEnumType) =>
    array.filter((item) => gearClosetCategories.includes(item.name));

  const getMatchingTagToSearch = allGearListItems.find((i) => i.name === tagToSearch);

  return (
    <>
      <Row>
        <Column xs={6} sm={5} md={5}>
          <InputWrapper>
            <StyledLabel>Search:</StyledLabel>
            <StyledInput
              type="text"
              value={valueToSearch || ''}
              onChange={(e) => {
                setValueToSearch(e.target.value);
                setTagToSearch('');
                onChange({ val: e.target.value, subCat: '' });
              }}
              placeholder="Search anything..."
            />
          </InputWrapper>
        </Column>
        <Column xs={6} sm={5} md={5}>
          <InputWrapper>
            <StyledLabel>Filter by Tag:</StyledLabel>
            <Select
              className="react-select"
              styles={multiSelectStyles}
              isMulti={false}
              menuPlacement="auto"
              isSearchable={!size.isExtraSmallScreen}
              value={{
                value: getMatchingTagToSearch?.name || '',
                label: getMatchingTagToSearch?.label || tagToSearch || '',
              }}
              options={[
                {
                  label: 'Activities',
                  options: createOptionsFromGearListArray(
                    profile.isAdmin ? gearListActivities : getFilteredCategories(gearListActivities)
                  ),
                },
                {
                  label: 'Accommodations',
                  options: createOptionsFromGearListArray(
                    profile.isAdmin
                      ? gearListAccommodations
                      : getFilteredCategories(gearListAccommodations)
                  ),
                },
                {
                  label: 'Camp Kitchen',
                  options: createOptionsFromGearListArray(
                    profile.isAdmin
                      ? gearListCampKitchen
                      : getFilteredCategories(gearListCampKitchen)
                  ),
                },
                {
                  label: 'Other Considerations',
                  options: createOptionsFromGearListArray(
                    profile.isAdmin
                      ? gearListOtherConsiderations
                      : getFilteredCategories(gearListOtherConsiderations)
                  ),
                },
              ]}
              onChange={(option) => {
                setValueToSearch('');
                setTagToSearch(option?.label || '');
                onChange({ val: '', subCat: option?.value || '' });
              }}
            />
          </InputWrapper>
        </Column>
        <Column sm={2}>
          {(valueToSearch !== '' || tagToSearch !== '') && (
            <InputWrapper>
              {!size.isExtraSmallScreen && <StyledLabel>&nbsp;</StyledLabel>}
              <Button
                type="button"
                color="tertiary"
                block
                onClick={() => {
                  setValueToSearch('');
                  setTagToSearch('');
                  onChange({ val: '', subCat: '' });
                }}
                disabled={!valueToSearch && !tagToSearch}
              >
                Clear
              </Button>
            </InputWrapper>
          )}
        </Column>
      </Row>
    </>
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
  const { search, currentPage, sortColumn, sortDirection, tag } = getQueryStringParams(location);
  const [valueToSearch, setValueToSearch] = useState(search || '');
  const [tagToSearch, setTagToSearch] = useState(tag || '');

  const fuzzyTextFilterFn = (rows: Array<any>, _: any, filterValue: string) => {
    const stringMatches = matchSorter(rows, filterValue, {
      keys: [
        { threshold: matchSorter.rankings.WORD_STARTS_WITH, key: 'values.name' },
        { threshold: matchSorter.rankings.CONTAINS, key: 'values.category' },
      ],
    });
    const categoryMatches = rows.filter((row) => row.original[filterValue] === true);
    return uniqBy([...stringMatches, ...categoryMatches], 'id');
  };

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
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
      globalFilter: 'fuzzyText',
      initialState: {
        pageSize: rowsPerPage || 10,
        globalFilter: search || tag || '',
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
          setValueToSearch={setValueToSearch}
          valueToSearch={valueToSearch as string}
          setTagToSearch={setTagToSearch}
          tagToSearch={tagToSearch as string}
          location={location}
        />
      )}
      <StyledTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const headerGroupProps = headerGroup.getHeaderGroupProps();
            return (
              <StyledTr {...headerGroupProps} key={headerGroupProps.key}>
                {headerGroup.headers.map((column, index) => {
                  const thProps = hasSorting
                    ? column.getHeaderProps(column.getSortByToggleProps())
                    : {};
                  return (
                    <StyledTh
                      key={column.render('header') as string}
                      {...thProps}
                      style={{ width: index === headerGroup.headers.length - 1 ? 80 : 'auto' }}
                      title={column.canSort ? `Sort by ${column.render('header')}` : ''}
                      onClick={() => {
                        if (column.canSort) {
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
                        }
                      }}
                    >
                      {index === headerGroup.headers.length - 1 ? '' : column.render('header')}

                      {hasSorting && (
                        <>
                          {' '}
                          {column.isSorted && column.isSortedDesc && <FaSortAlphaUp />}
                          {column.isSorted && !column.isSortedDesc && <FaSortAlphaDown />}
                          {!column.isSorted && column.canSort && <FaSort color={textColorLight} />}
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
          {isLoading || (!valueToSearch && !tagToSearch && pageOrRows.length === 0) ? (
            <>
              {Array.from({ length: rowsPerPage || 10 }).map((_, rowIndex) => (
                <StyledTr key={`loadingTableRow${rowIndex}`}>
                  {Array.from({ length: columns.length - 1 }).map((__, cellIndex) => (
                    <StyledTd key={`loadingTableRow${rowIndex}-cell${cellIndex}`}>
                      <Skeleton
                        count={1}
                        // random widths between 40 and 90%
                        width={`${Math.floor(Math.random() * (90 - 40 + 1) + 40)}%`}
                        height={baseAndAHalfSpacer}
                      />
                    </StyledTd>
                  ))}
                  <StyledTd>
                    <FlexContainer justifyContent="flex-end" flexWrap="nowrap">
                      <IconWrapper>
                        <FaChevronRight />
                      </IconWrapper>
                    </FlexContainer>
                  </StyledTd>
                </StyledTr>
              ))}
            </>
          ) : (
            <>
              {pageOrRows.length > 0 ? (
                pageOrRows.map((row) => {
                  prepareRow(row);
                  return (
                    <StyledTr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => {
                        // if cell.
                        return (
                          <StyledTd {...cell.getCellProps()} key={cell.getCellProps().key}>
                            {String(cell.getCellProps().key).includes('action') ? (
                              <FlexContainer justifyContent="flex-end" flexWrap="nowrap">
                                <IconWrapper
                                  onClick={() => navigate(cell.row.original.actions[0].to)}
                                  hoverColor={brandPrimary}
                                  color={lightestGray}
                                >
                                  <FaPencilAlt />
                                </IconWrapper>
                                <IconWrapper
                                  onClick={cell.row.original.actions[1].onClick}
                                  hoverColor={brandDanger}
                                  color={lightestGray}
                                  style={{
                                    marginLeft: halfSpacer,
                                  }}
                                >
                                  <FaTrash />
                                </IconWrapper>
                              </FlexContainer>
                            ) : (
                              cell.value
                            )}
                          </StyledTd>
                        );
                      })}
                    </StyledTr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: doubleSpacer, textAlign: 'center' }}>
                    <FlexContainer flexDirection="column">
                      <p>
                        No results found for <strong>{search}</strong>
                      </p>
                      <Button
                        type="button"
                        color="tertiary"
                        size="small"
                        onClick={() => {
                          setValueToSearch('');
                          navigate(mergeQueryParams({ currentPage: '', search: '' }, location), {
                            replace: false,
                          });
                        }}
                      >
                        Clear
                      </Button>
                    </FlexContainer>
                  </td>
                </tr>
              )}
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
                  color="tertiary"
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
                  color="tertiary"
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
                  color="tertiary"
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
                  color="tertiary"
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
        </>
      )}
    </>
  );
};

export default Table;
