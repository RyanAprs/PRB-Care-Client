import {useContext, useEffect, useRef, useState} from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {ZodError} from "zod";
import {Toast} from "primereact/toast";
import ModalLoading from '/src/components/modalLoading/ModalLoading.jsx';
import {
    handleApiError,
    handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import {
    createObat,
    deleteObat,
    getAllObat,
    getObatById,
    updateObat,
} from "../../../services/ObatService";
import {
    createObatSchema,
    updateObatSchema,
} from "../../../validations/ObatSchema";
import {ProgressSpinner} from "primereact/progressspinner";
import {useNavigate} from "react-router-dom";
import {HandleUnauthorizedAdminSuper} from "../../../utils/HandleUnauthorized";
import {AuthContext} from "../../../config/context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {getAllApotek} from "../../../services/ApotekService";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const DataObat = () => {
    const [beforeModalLoading,setBeforeModalLoading] = useState(false)
    const {dispatch} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [dataAdminApotek, setDataAdminApotek] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const {token} = useContext(AuthContext);
    const [datas, setDatas] = useState({
        namaObat: "",
        jumlah: 0,
        idAdminApotek: "",
    });
    const [currentId, setCurrentId] = useState("");
    const [currentName, setCurrentName] = useState("");
    const toast = useRef(null);
    const title = "Obat";
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [isConnectionError, setisConnectionError] = useState(false);
    const [isButtonLoading, setButtonLoading] = useState(null);

    const customSort = (a, b) => {
        if (a.namaObat < b.namaObat) return -1;
        if (a.namaObat > b.namaObat) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllObat();
            const sortedData = response.sort(customSort);
            setData(sortedData);
            setLoading(false);
            setisConnectionError(false);
        } catch (error) {
            if (
                error.code === "ERR_NETWORK" ||
                error.code === "ETIMEDOUT" ||
                error.code === "ECONNABORTED" ||
                error.code === "ENOTFOUND" ||
                error.code === "ECONNREFUSED" ||
                error.code === "EAI_AGAIN" ||
                error.code === "EHOSTUNREACH" ||
                error.code === "ECONNRESET" ||
                error.code === "EPIPE"
            ) {
                setisConnectionError(true);
            }
            HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [token, navigate, dispatch]);

    const handleModalCreate = async () => {
        setErrors({});
        setDatas({
            namaObat: "",
            jumlah: 0,
            idAdminApotek: 0,
        });
        setVisible(true);
        setIsEditMode(false);

        try {
            const responseApotek = await getAllApotek();
            setDataAdminApotek(responseApotek);
            setLoading(false);
        } catch (error) {
            HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            setButtonLoading(true);
            createObatSchema.parse(datas);
            const response = await createObat(datas);
            if (response.status === 201) {
                toast.current.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Data obat ditambahkan",
                    life: 3000,
                });
                setVisible(false);
                const dataResponse = await getAllObat();
                const sortedData = dataResponse.sort(customSort);
                setData(sortedData);
                setButtonLoading(false);
            }
        } catch (error) {
            setButtonLoading(false);
            if (error instanceof ZodError) {
                const newErrors = {};
                error.errors.forEach((e) => {
                    newErrors[e.path[0]] = e.message;
                });
                setErrors(newErrors);
            } else {
                setVisible(false);
                handleApiError(error, toast);
                HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            }
        }
    };

    const handleModalUpdate = async (data) => {
        setBeforeModalLoading(true)
        setErrors({});
        try {
            const responseApotek = await getAllApotek();
            setDataAdminApotek(responseApotek);
            setLoading(false);
        } catch (error) {
            HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            setLoading(false);
        }
        try {
            const dataResponse = await getObatById(data.id);
            if (dataResponse) {
                setDatas({
                    namaObat: dataResponse.namaObat,
                    jumlah: dataResponse.jumlah,
                    idAdminApotek: dataResponse.idAdminApotek,
                });
                setCurrentId(data.id);
                setVisible(true);
                setIsEditMode(true);
            }
        } catch (error) {
            HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            handleApiError(error, toast);
        }
        setBeforeModalLoading(false)
    };

    const handleUpdate = async () => {
        try {
            setButtonLoading(true);
            updateObatSchema.parse(datas);
            const response = await updateObat(currentId, datas);
            if (response.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Data obat diperbarui",
                    life: 3000,
                });
                setVisible(false);
                const dataResponse = await getAllObat();
                const sortedData = dataResponse.sort(customSort);
                setData(sortedData);
                setButtonLoading(false);
            }
        } catch (error) {
            setButtonLoading(false);
            if (error instanceof ZodError) {
                const newErrors = {};
                error.errors.forEach((e) => {
                    newErrors[e.path[0]] = e.message;
                });
                setErrors(newErrors);
            } else {
                setVisible(false);
                handleApiError(error, toast);
                HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
            }
        }
    };

    const handleModalDelete = async (data) => {
        setCurrentId(data.id);
        setCurrentName(data.namaObat);
        setVisibleDelete(true);
    };

    const handleDelete = async () => {
        setVisibleDelete(false);
        try {
            const response = await deleteObat(currentId);

            if (response.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Berhasil",
                    detail: "Data Obat dihapus",
                    life: 3000,
                });
                const response = await getAllObat();
                const sortedData = response.sort(customSort);
                setData(sortedData);
            }
        } catch (error) {
            setVisibleDelete(false);
            handleDeleteError(error, toast, title);
            HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text("Data Obat", 20, 10);

        const tableColumn = columns.map((col) => col.header);

        const tableRows = data.map((item) => {
            return columns.map((col) => {
                const fields = col.field.split(".");
                let value = item;
                fields.forEach((field) => {
                    value = value ? value[field] : "";
                });
                return value || "-";
            });
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("data-obat.pdf");
    };

    const columns = [
        {header: "Nama Obat", field: "namaObat"},
        {header: "Jumlah", field: "jumlah"},
        {header: "Apotek", field: "adminApotek.namaApotek"},
    ];

    const itemTemplateApotek = (option) => {
        return (
            <div>
                {option.namaApotek} - {option.telepon}
            </div>
        );
    };

    const valueTemplateApotek = (option) => {
        if (option) {
            return (
                <div>
                    {option.namaApotek} - {option.telepon}
                </div>
            );
        }
        return <span>Pilih Apotek</span>;
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
                <div
                    className="bg-white min-h-screen dark:bg-blackHover p-4 rounded-xl flex items-center justify-center">
                    <ProgressSpinner/>
                </div>
            </div>
        );

    if (isConnectionError) {
        return <ErrorConnection fetchData={fetchData}/>;
    }

    return (
        <div className="flex  flex-col gap-4 p-4 min-h-screen ">
            <ModalLoading className={beforeModalLoading?``:`hidden`} />
            <Toast
                ref={toast}
                position={window.innerWidth <= 767 ? "top-center" : "top-right"}
            />
            <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
                <ReusableTable
                    columns={columns}
                    data={data}
                    onDelete={handleModalDelete}
                    onEdit={handleModalUpdate}
                    onCreate={handleModalCreate}
                    onDownload={handleDownload}
                    statusOptions=""
                />
            </div>

            <Dialog
                header={isEditMode ? "Ubah Data Obat" : "Tambah Data Obat"}
                visible={visible}
                maximizable
                className="md:w-1/2 w-full "
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <div className="flex flex-col p-4 gap-4">
                    <label htmlFor="" className="-mb-3">
                        Pilih apotek:
                    </label>

                    <Dropdown
                        value={
                            dataAdminApotek && dataAdminApotek.length > 0
                                ? dataAdminApotek.find(
                                (apotek) => apotek.id === datas.idAdminApotek
                            ) || null
                                : null
                        }
                        options={dataAdminApotek || []}
                        itemTemplate={itemTemplateApotek}
                        valueTemplate={valueTemplateApotek}
                        filter
                        optionLabel="namaApotek"
                        placeholder="Pilih Apotek"
                        className="p-2 rounded"
                        onChange={(e) =>
                            setDatas((prev) => ({
                                ...prev,
                                idAdminApotek: e.value.id,
                            }))
                        }
                    />

                    {errors.idAdminApotek && (
                        <small className="p-error -mt-3 text-sm">
                            {errors.idAdminApotek}
                        </small>
                    )}
                    <label htmlFor="" className="-mb-3">
                        Nama obat:
                    </label>

                    <InputText
                        type="text"
                        placeholder="Nama Obat"
                        className="p-input text-lg p-3  rounded"
                        value={datas.namaObat}
                        onChange={(e) =>
                            setDatas((prev) => ({
                                ...prev,
                                namaObat: e.target.value,
                            }))
                        }
                    />
                    {errors.namaObat && (
                        <small className="p-error -mt-3 text-sm">{errors.namaObat}</small>
                    )}
                    <label htmlFor="" className="-mb-3">
                        Jumlah obat:
                    </label>

                    <InputText
                        type="number"
                        placeholder="Jumlah"
                        className="p-input text-lg p-3  rounded"
                        value={datas.jumlah}
                        onChange={(e) =>
                            setDatas((prev) => ({
                                ...prev,
                                jumlah: parseInt(e.target.value, 10) || 0,
                            }))
                        }
                    />
                    {errors.jumlah && (
                        <small className="p-error -mt-3 text-sm">{errors.jumlah}</small>
                    )}

                    <Button
                        disabled={isButtonLoading}
                        className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
                        onClick={isEditMode ? handleUpdate : handleCreate}
                    >
                        {isButtonLoading ? (
                            <ProgressSpinner
                                style={{width: "25px", height: "25px"}}
                                strokeWidth="8"
                                animationDuration="1s"
                                color="white"
                            />
                        ) : (
                            <p>{isEditMode ? "Edit" : "Simpan"}</p>
                        )}
                    </Button>
                </div>
            </Dialog>

            <Dialog
                header="Hapus Data Obat"
                visible={visibleDelete}
                className="md:w-1/2 w-full"
                onHide={() => setVisibleDelete(false)}
            >
                <div className="flex flex-col gap-8">
                    <div className="text-xl">
                        Apakah anda yakin ingin menghapus data {currentName}?
                    </div>
                    <div className="flex gap-4 items-end justify-end">
                        <Button
                            label="Batal"
                            onClick={() => setVisibleDelete(false)}
                            className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
                        />
                        <Button
                            label="Hapus"
                            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
                            onClick={handleDelete}
                            autoFocus
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default DataObat;
