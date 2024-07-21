import React from "react";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronsLeft, DeleteIcon, EditIcon } from "lucide-react";
import { useTable, usePagination } from "react-table";

const list = [
  {
    nama_apotek: "nama apotek 1",
    username: "username 1",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek 2",
    username: "username 2",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek 2",
    username: "username 2",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek 3",
    username: "username 3",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek 4",
    username: "username 4",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek 5",
    username: "username 5",
    telepon: "12345",
    alamat: "alamat",
  },
  {
    nama_apotek: "nama apotek6 ",
    username: "username 6",
    telepon: "12345",
    alamat: "alamat",
  },
];

const DataPuskesmas = () => {
  const data = React.useMemo(() => list, []);

  const columns = React.useMemo(
    () => [
      { Header: "Nama Apotek", accessor: "nama_apotek" },
      { Header: "Username", accessor: "username" },
      { Header: "Kontak", accessor: "telepon" },
      { Header: "Alamat", accessor: "alamat" },
      {
        Header: "Aksi",
        Cell: ({ row }) => (
          <div className="flex justify-evenly items-center">
            <button onClick={() => handleEdit(row.original)}>
              <EditIcon />
            </button>
            <button onClick={() => handleDelete(row.original)}>
              <DeleteIcon />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    usePagination
  );

  const handleEdit = (row) => {
    console.log("Edit: ", row);
  };

  const handleDelete = (row) => {
    console.log("Delete: ", row);
  };

  return (
    <div className="h-full w-full flex flex-col items-center p-2 md:p-6 gap-4 overflow-y-auto">
      <div className="flex w-full justify-end mb-4">
        <Button color="default" variant="solid" className="dark:bg-blackHover">
          Tambah Data
        </Button>
      </div>
      <div className="md:h-full h-full overflow-x-auto w-full flex">
        <table
          {...getTableProps()}
          className="min-w-full bg-white dark:bg-blackHover overflow-x-auto"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-4 py-4 border"
                    key={index}
                  >
                    {column.render("Header")}
                  </th>
                ))}
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
                      className="px-4 py-3 border"
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex w-full justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border p-2"
          >
            {[2, 4, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <ChevronsLeft />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <ChevronLeft />
          </button>
          <span className="px-2">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPuskesmas;
