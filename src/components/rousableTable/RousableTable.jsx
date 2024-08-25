import {useState, useEffect} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {
    CirclePlus,
    Ban,
    CircleCheckBig,
    Search,
    Trash2,
    Edit,
    CircleOff,
    FileText,
} from "lucide-react";

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
                                          onDownload,
                                      }) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);

    useEffect(() => {
        if (statuses && statuses.length > 0 && statuses[0].key !== "all") {
            statuses.unshift({key: "all", label: "Semua"});
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
            className="w-full "
        />
    );

    const actionBodyTemplate = (rowData) => {
        const status = rowData.status;

        if (!statuses) {
            return (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="warning"
                        onClick={() => onEdit(rowData)}
                    >
                        <Edit style={{color: "var(--surface-0) !important"}}/>
                    </Button>
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="danger"
                        onClick={() => onDelete(rowData)}
                    >
                        <Trash2/>
                    </Button>
                </div>
            );
        } else if (role === "apoteker" && status === "diambil") {
            return (
                <>
                    <Ban size="30" className="mx-auto "/>
                </>
            );
        } else if (role === "apoteker" && status === "batal") {
            return (
                <>
                    <Ban size="30" className="mx-auto"/>
                </>
            );
        } else if (
            status === "selesai" ||
            status === "batal" ||
            status === "diambil"
        ) {
            return (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="danger"
                        onClick={() => onDelete(rowData)}
                    >
                        <Trash2/>
                    </Button>
                </div>
            );
        } else if (status === "menunggu" && role === "admin") {
            return (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="warning"
                        onClick={() => onEdit(rowData)}
                    >
                        <Edit style={{color: "var(--surface-0) !important"}}/>
                    </Button>
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        onClick={() => onDone(rowData)}
                    >
                        <CircleCheckBig/>
                    </Button>
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="danger"
                        onClick={() => onCancelled(rowData)}
                    >
                        <CircleOff/>
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
                                className="p-2  md:text-lg text-sm rounded-xl"
                                severity="warning"
                                onClick={() => onEdit(rowData)}
                            >
                                <Edit style={{color: "var(--surface-0) !important"}}/>
                            </Button>
                            <Button
                                size="sm"
                                className="p-2  md:text-lg text-sm rounded-xl"
                                onClick={() => onDone(rowData)}
                            >
                                <CircleCheckBig/>
                            </Button>
                            <Button
                                size="sm"
                                className="p-2  md:text-lg text-sm rounded-xl"
                                severity="danger"
                                onClick={() => onCancelled(rowData)}
                            >
                                <CircleOff/>
                            </Button>
                        </div>
                    )}
                    {path === "pengambilanObat" && (
                        <div className="flex justify-center gap-2">
                            <Button
                                size="sm"
                                className="p-2  md:text-lg text-sm rounded-xl"
                                severity="warning"
                                onClick={() => onEdit(rowData)}
                            >
                                <Edit style={{color: "var(--surface-0) !important"}}/>
                            </Button>
                            <Button
                                size="sm"
                                className="p-2  md:text-lg text-sm rounded-xl"
                                severity="danger"
                                onClick={() => onCancelled(rowData)}
                            >
                                <CircleOff/>
                            </Button>
                        </div>
                    )}
                </>
            );
        } else if (status === "menunggu" && role === "apoteker") {
            return (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className="p-2 md:text-lg text-sm rounded-xl"
                        onClick={() => onDone(rowData)}
                    >
                        <CircleCheckBig/>
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        severity="warning"
                        onClick={() => onEdit(rowData)}
                    >
                        <Edit style={{color: "var(--surface-0) !important"}}/>
                    </Button>
                    <Button
                        size="sm"
                        className="p-2  md:text-lg text-sm rounded-xl"
                        onClick={() => onDone(rowData)}
                    >
                        <CircleCheckBig/>
                    </Button>
                </div>
            );
        }
    };

    const formatCellContent = (data, field) => {
        const fields = field.split(".");
        let value = data;

        for (const f of fields) {
            value = value ? value[f] : "";
        }

        const valueString = value ? value.toString() : "";

        if (valueString.includes(",") && field === "waktuOperasional") {
            return (
                <ul className="list-disc pl-5">
                    {valueString.split(",").map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                    ))}
                </ul>
            );
        }
        if (field === "telepon" || field === "teleponKeluarga") {
            return (
                <a href={`https://api.whatsapp.com/send/?phone=${valueString}`} target="_blank"
                   className="hover:text-lightGreen hover:dark:text-mainGreen">{valueString}</a>
            )
        }

        return <span>{valueString}</span>;
    };

    return (
        <div className="p-4 w-full ">
            <div className="card p-6 w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:gap-0 gap-4 w-full justify-between items-center md:mb-4">
                    <div className="p-inputgroup md:w-1/2">
            <span className="p-inputgroup-addon bg-grays dark:bg-darkGrays">
              <Search size={16}/>
            </span>
                        <InputText
                            type="search"
                            value={globalFilter}
                            onChange={onGlobalFilterChange}
                            placeholder="Search..."
                            className=""
                        />
                    </div>
                    <div
                        className={`flex gap-2 items-center ${statuses && statuses.length > 0 ? "justify-center md:justify-end" : "justify-end"} w-full`}>
                        {statuses && statuses.length > 0 && (
                            <div>{statusRowFilterTemplate}</div>
                        )}
                        <Button
                            onClick={onCreate}
                            className={`${
                                path === "pengguna" ||
                                path === "pengambilanObatApoteker" ||
                                path === "dataApotekPuskesmas"
                                    ? "hidden"
                                    : ""
                            } block p-2 rounded-xl bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen`}
                            label={<CirclePlus/>}
                        />
                        <Button
                            onClick={onDownload}
                            className="p-2 rounded-xl bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen"
                            label={<FileText/>}
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
                        tableStyle={{minWidth: "50rem"}}
                        currentPageReportTemplate="{first} to {last} of {totalRecords} entries"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        globalFilter={globalFilter}
                        editMode="row"
                        removableSort
                        resizableColumns
                        sortMode="multiple"
                    >
                        {!(path === "pengguna" || path === "dataApotekPuskesmas") && (
                            <Column
                                header="Aksi"
                                headerStyle={{width: "5%", minWidth: "2rem"}}
                                body={actionBodyTemplate}
                                bodyStyle={{textAlign: "center"}}
                            />
                        )}

                        {columns.map((col, index) => (
                            <Column
                                key={index}
                                field={col.field}
                                header={col.header}
                                sortable
                                body={(data) => formatCellContent(data, col.field)}
                                className="p-4"
                            />
                        ))}
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
