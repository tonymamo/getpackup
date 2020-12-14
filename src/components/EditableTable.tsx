import React, { FunctionComponent } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import styled from 'styled-components';

import { quarterSpacer, baseSpacer } from '../styles/size';
import { baseBorderStyle } from '../styles/mixins';
import { lightestGray, white } from '../styles/color';
import Button, { ButtonProps } from './Button';
import FlexContainer from './FlexContainer';

type EditableTableActionType = {
  to?: string;
  label: string;
  icon: JSX.Element;
  color: ButtonProps['color'];
  onClick?: () => void;
};

type EditableTableProps = {
  columns: Array<{
    header: string;
    accessor: string;
  }>;
  data: Array<any>;
  actions?: Array<EditableTableActionType>;
  hasPagination?: boolean;
  hasSorting?: boolean;
  updateMyData: (rowIndex: any, columnId: any, value: any) => void;
  skipPageReset: boolean;
};

const StyledEditableTable = styled.table`
  margin-bottom: ${baseSpacer};
  width: 100%;
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

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const EditableTable: FunctionComponent<EditableTableProps> = ({
  columns,
  data,
  hasPagination,
  hasSorting,
  updateMyData,
  skipPageReset,
}) => {
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
    headerGroups,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    useSortBy,
    usePagination
  );
  const pageOrRows = hasPagination ? page : rows;

  return (
    <>
      <StyledEditableTable {...getTableProps()}>
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
                          <span>{column.isSorted && column.isSortedDesc && '🔽'}</span>
                          <span>{column.isSorted && !column.isSortedDesc && '🔼'}</span>
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
                            cell.row.original.actions.map((action: EditableTableActionType) => {
                              if (action.onClick) {
                                return (
                                  <Button
                                    type="button"
                                    key={action.label}
                                    onClick={action.onClick}
                                    color={action.color || 'text'}
                                    iconLeft={action.icon}
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
                                    key={action.label}
                                    to={action.to}
                                    color={action.color || 'text'}
                                    iconLeft={action.icon}
                                  >
                                    {action.label}
                                  </Button>
                                );
                              }
                              return null;
                            })}
                        </>
                      ) : (
                        cell.render('Cell')
                      )}
                    </StyledTd>
                  );
                })}
              </StyledTr>
            );
          })}
        </tbody>
      </StyledEditableTable>
      {hasPagination && pageOptions.length > 1 && (
        <>
          <FlexContainer justifyContent="space-between">
            <div>
              <Button
                type="button"
                color="primaryOutline"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {'<<'}
              </Button>
              <Button
                type="button"
                color="primaryOutline"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </Button>
            </div>
            <span>
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <div>
              <Button
                type="button"
                color="primaryOutline"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {'>'}
              </Button>
              <Button
                type="button"
                color="primaryOutline"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </Button>
            </div>
          </FlexContainer>
          <p>&nbsp;</p>
        </>
      )}
    </>
  );
};

export default EditableTable;
