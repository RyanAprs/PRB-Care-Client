import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../config/context/AuthContext";
import {getAllKontrolBalik} from "../../../services/KontrolBalikService";
import {HandleUnauthorizedPengguna} from "../../../utils/HandleUnauthorized";
import {ProgressSpinner} from "primereact/progressspinner";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import img from "../../../assets/data_empty.png";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const Kontrol = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);
    const {token} = useContext(AuthContext);
    const [isConnectionError, setisConnectionError] = useState(false);

    const customSort = (a, b) => {
        const statusOrder = ["menunggu", "selesai", "batal"];
        if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
            return -1;
        if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
        if (a.pasien.tanggalKontrol < b.pasien.tanggalKontrol) return -1;
        if (a.pasien.tanggalKontrol > b.pasien.tanggalKontrol) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllKontrolBalik();
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
            setLoading(false);
            HandleUnauthorizedPengguna(error.response, dispatch, navigate);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, navigate, dispatch]);

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text("Data Kontrol", 20, 10);

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

        doc.save("data-kontrol.pdf");
    };

    const columns = [
        {header: "No Rekam Medis", field: "pasien.noRekamMedis"},
        {header: "Tanggal Kontrol", field: "tanggalKontrol"},
        {header: "Nomor Antrean", field: "noAntrean"},
        {header: "Nama Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas"},
        {header: "Telepon Puskesmas", field: "pasien.adminPuskesmas.telepon"},
        {header: "Keluhan", field: "keluhan"},
        {header: "Berat Badan", field: "beratBadan"},
        {header: "Tinggi Badan", field: "tinggiBadan"},
        {header: "Denyut Nadi", field: "denyutNadi"},
        {header: "Tekanan Darah", field: "tekananDarah"},
        {header: "Hasil LAB", field: "hasilLab"},
        {header: "Hasil EKG", field: "hasilEkg"},
        {header: "Hasil Diagnosa", field: "hasilDiagnosa"},
        {header: "Status", field: "status"},
    ];
    const statuses = [
        {key: "menunggu", label: "Menunggu"},
        {key: "selesai", label: "Selesai"},
        {key: "batal", label: "Batal"},
    ];

    if (loading) {
        return (
            <div
                className="md:p-4 p-2 dark:bg-black bg-whiteGrays max-h-fit min-h-screen  flex justify-center items-center">
                <div
                    className="p-8 w-full max-h-fit min-h-screen flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
                    <ProgressSpinner/>
                </div>
            </div>
        );
    }

    if (isConnectionError) {
        return <ErrorConnection fetchData={fetchData}/>;
    }

    return (
        <div className=" md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
            <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
                <div className="flex flex-col p-1 gap-4  min-h-screen max-h-fit">
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
                            className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
                            <img src={img} className="w-52" alt="img"/>
                            <div>
                                Belum Ada Data
                                <p className="font-medium text-xl">
                                    Data akan muncul di sini ketika tersedia.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kontrol;
