import {useContext, useEffect, useState} from "react";
import {HandleUnauthorizedPengguna} from "../../../utils/HandleUnauthorized";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../config/context/AuthContext";
import {ProgressSpinner} from "primereact/progressspinner";
import {getAllPengambilanObat} from "../../../services/PengambilanObatService";
import ReusableTable from "../../../components/reusableTable/ReusableTable.jsx";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import EmptyData from "../../../components/emptyData/EmptyData";

const Obat = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);
    const {token} = useContext(AuthContext);
    const [isConnectionError, setisConnectionError] = useState(false);
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
    const customSort = (a, b) => {
        const statusOrder = ["menunggu", "diambil", "batal"];

        if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
            return -1;
        if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
        if (a.tanggalPengambilan < b.tanggalPengambilan) return -1;
        if (a.tanggalPengambilan > b.tanggalPengambilan) return 1;

        return 0;
    };
    const columns = [
        {header: "Resi", field: "resi"},
        {header: "Tanggal Pengambilan", field: "tanggalPengambilan"},
        {header: "Nama Obat", field: "obat.namaObat"},
        {header: "Jumlah", field: "jumlah"},
        {header: "Nama Apotek", field: "obat.adminApotek.namaApotek"},
        {header: "Telepon Apotek", field: "obat.adminApotek.telepon"},
        {header: "Status", field: "status"},
    ];
    const statuses = [
        {key: "menunggu", label: "Menunggu"},
        {key: "diambil", label: "Diambil"},
        {key: "batal", label: "Batal"},
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllPengambilanObat();
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

    if (loading)
        return (
            <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
                <div
                    className="p-8 w-full h-full flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
                    <ProgressSpinner/>
                </div>
            </div>
        );
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
                        <EmptyData/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Obat;
