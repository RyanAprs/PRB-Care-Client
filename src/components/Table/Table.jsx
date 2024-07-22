// TableComponent.jsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Delete,
  Edit,
} from "lucide-react";
import React from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";

// Fungsi filter global
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => <></>;

const Table = ({ columns, data, onUpdate, onDelete }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="p-8 bg-white dark:bg-blackHover">
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="mb-4 flex items-center">
        <label htmlFor="pageSize" className="mr-2 text-sm ">
          Show
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="p-2 border dark:border-black border-gray-300 rounded"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full border-collapse border dark:border-black border-gray-200"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border dark:border-black dark:bg-blackHover border-gray-300 p-2 text-left text-sm font-medium"
                    key={index}
                  >
                    {column.render("Header")}
                  </th>
                ))}
                <th className="border dark:border-black dark:bg-blackHover border-gray-300 p-2 text-left text-sm font-medium">
                  Aksi
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => (
                    <td
                      {...cell.getCellProps()}
                      className="border dark:border-black border-gray-300 p-2 text-sm"
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                  <td className="border dark:border-black border-gray-300 p-2 text-sm flex justify-evenly">
                    <button onClick={() => onUpdate(row.original)} className="">
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(row.original)}
                      className="ml-2"
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex items-center justify-center gap-8">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="p-2 border border-gray-300 rounded dark:border-black"
        >
          <ChevronsLeft />
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="p-2 border border-gray-300 rounded dark:border-black"
        >
          <ChevronLeft />
        </button>
        <span className="ml-4 text-sm">
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 rounded dark:border-black"
        >
          <ChevronRight />
        </button>
        <button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 rounded dark:border-black"
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
};

export default Table;
