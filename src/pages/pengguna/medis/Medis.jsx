import {useContext, useEffect, useState} from "react";
import {HandleUnauthorizedPengguna} from "../../../utils/HandleUnauthorized";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../config/context/AuthContext";
import {ProgressSpinner} from "primereact/progressspinner";
import img from "../../../assets/data_empty.png";
import {getAllPasien} from "../../../services/PasienService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const Medis = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);
    const {token} = useContext(AuthContext);
    const [isConnectionError, setisConnectionError] = useState(false);

    const customSort = (a, b) => {
        if (a.status < b.status) return -1;
        if (a.status > b.status) return 1;
        if (a.tanggalDaftar < b.tanggalDaftar) return -1;
        if (a.tanggalDaftar > b.tanggalDaftar) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllPasien();
            const sortedData = response.sort(customSort);
            setData(sortedData);
            setLoading(false);
            setisConnectionError(false);
        } catch (error) {
            if (error.code === "ERR_NETWORK" ||
                error.code === "ETIMEDOUT" ||
                error.code === "ECONNABORTED" ||
                error.code === "ENOTFOUND" ||
                error.code === "ECONNREFUSED" ||
                error.code === "EAI_AGAIN" ||
                error.code === "EHOSTUNREACH" ||
                error.code === "ECONNRESET" ||
                error.code === "EPIPE") {
                setisConnectionError(true);
            }
            setLoading(false);
            HandleUnauthorizedPengguna(error.response, dispatch, navigate);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, navigate, dispatch]);

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text("Data Pasien", 20, 10);

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

        doc.save("data-medis.pdf");
    };

    const statuses = [
        {key: "aktif", label: "Aktif"},
        {key: "selesai", label: "Selesai"},
    ];

    const columns = [
        {header: "No Rekam Medis", field: "noRekamMedis"},
        {header: "Nama Puskesmas", field: "adminPuskesmas.namaPuskesmas"},
        {header: "Telepon Puskesmas", field: "adminPuskesmas.telepon"},
        {header: "Tanggal Terdaftar", field: "tanggalDaftar"},
        {header: "Status", field: "status"},
    ];

    if (loading)
        return (
            <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
                <div
                    className="p-8 w-full h-full flex items-center justify-center bg-white dark:bg-blackHover rounded-xl">
                    <ProgressSpinner/>
                </div>
            </div>
        );

    if (isConnectionError) {
        return (
            <ErrorConnection fetchData={fetchData}/>
        );
    }

    return (
        <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
            <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
                <div className="flex flex-col p-1 gap-4 min-h-screen max-h-fit">
                    {data.length > 0 ? (
                        <div className="row grid grid-cols-1 gap-6">
                            <ReusableTable
                                statuses={statuses}
                                columns={columns}
                                data={data}
                                path={"pengguna"}
                                onDownload={handleDownload}
                            />
                        </div>
                    ) : (
                        <div
                            className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
                            <img src={img} className="md:w-80 w-64" alt="img"/>
                            Belum Ada Data
                            <p className="font-medium text-xl">Data akan muncul di sini ketika tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Medis;
