import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Check, Search, Delete, Edit, X } from "lucide-react";

export default function ReusableTable({
  data,
  columns,
  onCreate,
  onEdit,
  onDelete,
  onDone,
  onCancelled,
  statuses,
  role,
  path,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (statuses && statuses.length > 0 && statuses[0].key !== "all") {
      statuses.unshift({ key: "all", label: "Semua" });
    }
  }, [statuses]);

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const onStatusFilterChange = (e) => {
    setSelectedStatus(e.value);
  };

  const filteredData =
    data?.filter((item) => {
      return (
        !selectedStatus ||
        selectedStatus.key === "all" ||
        item.status.toLowerCase() === selectedStatus.key.toLowerCase()
      );
    }) || [];

  const statusRowFilterTemplate = (
    <Dropdown
      value={selectedStatus}
      options={statuses}
      onChange={onStatusFilterChange}
      placeholder="Pilih Status"
      optionLabel="label"
      className="w-full bg-white dark:bg-blackHover"
    />
  );

  const actionBodyTemplate = (rowData) => {
    const status = rowData.status;

    if (!statuses) {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" severity="warning" onClick={() => onEdit(rowData)}>
            <Edit />
          </Button>
          <Button size="sm" severity="danger" onClick={() => onDelete(rowData)}>
            <Delete />
          </Button>
        </div>
      );
    } else if (
      status === "selesai" ||
      status === "batal" ||
      status === "diambil"
    ) {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" severity="danger" onClick={() => onDelete(rowData)}>
            <Delete />
          </Button>
        </div>
      );
    } else if (status === "menunggu" && role === "admin") {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" severity="warning" onClick={() => onEdit(rowData)}>
            <Edit />
          </Button>
          <Button size="sm" severity="success" onClick={() => onDone(rowData)}>
            <Check />
          </Button>
          <Button
            size="sm"
            severity="danger"
            onClick={() => onCancelled(rowData)}
          >
            <X />
          </Button>
        </div>
      );
    } else if (status === "menunggu" && role === "nakes") {
      return (
        <>
          {path === "kontrolBalik" && (
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                severity="warning"
                onClick={() => onEdit(rowData)}
              >
                <Edit />
              </Button>
              <Button
                size="sm"
                severity="success"
                onClick={() => onDone(rowData)}
              >
                <Check />
              </Button>
              <Button
                size="sm"
                severity="danger"
                onClick={() => onCancelled(rowData)}
              >
                <X />
              </Button>
            </div>
          )}
          {path === "pengambilanObat" && (
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                severity="warning"
                onClick={() => onEdit(rowData)}
              >
                <Edit />
              </Button>
              <Button
                size="sm"
                severity="danger"
                onClick={() => onCancelled(rowData)}
              >
                <X />
              </Button>
            </div>
          )}
        </>
      );
    } else if (status === "menunggu" && role === "apoteker") {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" severity="success" onClick={() => onDone(rowData)}>
            <Check />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm" severity="warning" onClick={() => onEdit(rowData)}>
            <Edit />
          </Button>
          <Button severity="success" size="sm" onClick={() => onDone(rowData)}>
            <Check />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="card p-6 bg-white dark:bg-blackHover w-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:gap-0 gap-4 w-full justify-between items-end md:items-center mb-4">
          <div className="p-inputgroup md:w-1/2">
              <span className="p-inputgroup-addon " style={{ backgroundColor: '#f8f9fa' }}>
              <Search color="black" size={16} />
              </span>
              <InputText
                  type="search"
                  value={globalFilter}
                  onChange={onGlobalFilterChange}
                  placeholder="Search..."
              />
          </div>
          <div className="flex gap-4  items-end">
            {statuses && statuses.length > 0 && (
              <div>{statusRowFilterTemplate}</div>
            )}
            <Button
              onClick={onCreate}
              text
              raised
              className=" bg-lightGreen dark:bg-darkGreen md:text-lg text-sm text-white rounded-xl"
              label="Tambah"
            />
          </div>
        </div>
        {filteredData.length > 0 ? (
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
                className="p-4 "
              />
            ))}
            <Column
              header="Aksi"
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              body={actionBodyTemplate}
              bodyStyle={{ textAlign: "center" }}
            />
          </DataTable>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
}
