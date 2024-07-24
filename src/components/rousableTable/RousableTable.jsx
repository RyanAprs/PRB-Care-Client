import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "datatables.net-responsive";
import { Delete, Edit } from "lucide-react";

// Component for handling nested data
const ReusableTableWithNestedData = ({ columns, data, onEdit, onDelete }) => {
  const tableRef = useRef();

  useEffect(() => {
    const $table = $(tableRef.current);

    if ($.fn.DataTable.isDataTable($table)) {
      $table.DataTable().destroy();
    }

    $table.DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
      pageLength: 10,
      scrollY: "400px",
      scrollCollapse: true,
      deferRender: true,
      scroller: true,
    });

    return () => {
      if ($.fn.DataTable.isDataTable($table)) {
        $table.DataTable().destroy();
      }
    };
  }, [data, columns]);

  const getColumnValue = (item, key) => {
    if (key && key.includes(".")) {
      return key.split(".").reduce((acc, part) => acc && acc[part], item);
    }
    return item[key];
  };

  return (
    <div className="relative bg-gray-50 dark:bg-blackHover p-4 w-[920px]">
      <div className="overflow-auto">
        <div className="min-h-[400px] overflow-y-auto">
          <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 dark:bg-blackHover">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-blackHover divide-y divide-gray-200 dark:divide-blackHover">
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {getColumnValue(item, column.key)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                    <button onClick={() => onEdit(item)}>
                      <Edit />
                    </button>
                    <button onClick={() => onDelete(item)}>
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component for handling non-nested data
const ReusableTable = ({ columns, data, onEdit, onDelete }) => {
  const tableRef = useRef();
  console.log(data);

  useEffect(() => {
    const $table = $(tableRef.current);

    if ($.fn.DataTable.isDataTable($table)) {
      $table.DataTable().destroy();
    }

    $table.DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
      pageLength: 10,
      scrollY: "400px",
      scrollCollapse: true,
      deferRender: true,
      scroller: true,
    });

    return () => {
      if ($.fn.DataTable.isDataTable($table)) {
        $table.DataTable().destroy();
      }
    };
  }, [data, columns]);

  return (
    <div className="relative bg-gray-50 dark:bg-blackHover p-4 w-[920px]">
      <div className="overflow-auto">
        <div className="min-h-[400px] overflow-y-auto">
          <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 dark:bg-blackHover">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-blackHover divide-y divide-gray-200 dark:divide-blackHover">
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                    <button onClick={() => onEdit(item)}>
                      <Edit />
                    </button>
                    <button onClick={() => onDelete(item)}>
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ReusableTableWithNestedData, ReusableTable };
