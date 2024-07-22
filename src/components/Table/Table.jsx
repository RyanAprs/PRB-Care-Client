// TableComponent.jsx
import { Input } from "@nextui-org/input";
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

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <input
      placeholder="Cari"
      className="border dark:border-white border-gray-400 dark:bg-blackHover rounded-xl p-3 w-full"
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
    />
  );
};

const Table = ({ columns, data, onUpdate, onDelete, dataTitle }) => {
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

  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, data.length);

  return (
    <div className="p-8 bg-white dark:bg-blackHover">
      <div className="py-4 flex w-full md:flex-row flex-col gap-4 md:gap-0 items-center justify-center md:justify-between">
        <div className="flex items-center w-full">
          <label htmlFor="pageSize" className="mr-2 text-sm ">
            Tampilkan
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-2 border dark:border-white border-gray-300 rounded"
          >
            {[10, 25, 50, 75, 100].map((size) => (
              <option key={size} value={size}>
                {size} baris
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          Menampilkan {startItem}-{endItem} dari {data.length} data {dataTitle}
        </div>
        <div className="flex items-center  md:w-1/2 w-full">
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full border-collapse border dark:border-white border-gray-200"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border dark:border-white dark:bg-blackHover border-gray-300 p-6 text-left text-sm font-medium"
                    key={index}
                  >
                    {column.render("Header")}
                  </th>
                ))}
                <th className="border dark:border-white dark:bg-blackHover border-gray-300 p-6 text-left text-sm font-medium">
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
                      className="border dark:border-white border-gray-300 p-4 text-sm"
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                  <td className="border dark:border-white border-gray-300 p-4 text-sm flex justify-evenly">
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
          className="p-2 border border-gray-300 rounded dark:border-white"
        >
          <ChevronsLeft />
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="p-2 border border-gray-300 rounded dark:border-white"
        >
          <ChevronLeft />
        </button>
        <span className="ml-4 text-sm">
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 rounded dark:border-white"
        >
          <ChevronRight />
        </button>
        <button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
          className="p-2 border border-gray-300 rounded dark:border-white"
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
};

export default Table;
