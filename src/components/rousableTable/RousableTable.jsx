import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Select, SelectItem } from "@nextui-org/react";
import { Delete, Edit } from "lucide-react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Button } from "primereact/button";

export default function ReusableTable({
  data,
  columns,
  onCreate,
  onEdit,
  onDelete,
  statuses,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const onStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const statusRowFilterTemplate = statuses && statuses.length > 0 && (
    <Select
      placeholder="Pilih status"
      value={statusFilter}
      onChange={(e) => onStatusFilterChange(e.target.value)}
      className="w-36"
      size="lg"
    >
      {statuses.map((status) => (
        <SelectItem key={status.key} value={status.key}>
          {status.label}
        </SelectItem>
      ))}
    </Select>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center gap-2">
        <Button size="sm" onClick={() => onEdit(rowData)}>
          <Edit />
        </Button>
        <Button size="sm" onClick={() => onDelete(rowData)}>
          <Delete />
        </Button>
      </div>
    );
  };

  const filteredData = data.filter((item) =>
    statusFilter ? item.status === statusFilter : true
  );

  return (
    <div className="p-4">
      <div className="card p-6 bg-white dark:bg-blackHover w-full">
        <div className="flex justify-between items-center mb-4 px-4">
          <InputText
            className="border bg-gray-100  dark:bg-blackHover p-3 rounded-xl"
            type="search"
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Search..."
          />
          <div className="flex gap-4">
            {statuses && statuses.length > 0 && (
              <div>{statusRowFilterTemplate}</div>
            )}
            <Button
              onClick={onCreate}
              text
              raised
              className="px-4 py-2 bg-lightGreen text-white rounded-xl"
              label="Tambah Data"
            />
          </div>
        </div>
        <DataTable
          value={filteredData}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 75, 100]}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          currentPageReportTemplate="{first} to {last} of {totalRecords} entries"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          globalFilter={globalFilter}
          editMode="row"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              sortable
              filter={col.field === "status"}
              filterElement={
                col.field === "status" && statuses && statuses.length > 0
                  ? statusRowFilterTemplate
                  : null
              }
              className="p-4  "
            />
          ))}
          <Column
            header="Aksi"
            headerStyle={{ width: "10%", minWidth: "8rem" }}
            body={actionBodyTemplate}
            bodyStyle={{ textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
}
