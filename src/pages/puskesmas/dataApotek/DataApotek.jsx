import {useContext, useEffect, useState} from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {AuthContext} from "../../../config/context/AuthContext";
import {ProgressSpinner} from "primereact/progressspinner";
import {getAllApotek} from "../../../services/ApotekService";
import {HandleUnauthorizedAdminPuskesmas} from "../../../utils/HandleUnauthorized";
import {useNavigate} from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const DataApotek = () => {
    const {dispatch} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isConnectionError, setisConnectionError] = useState(false);

    const customSort = (a, b) => {
        if (a.namaApotek < b.namaApotek) return -1;
        if (a.namaApotek > b.namaApotek) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllApotek();
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
            HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate, dispatch]);

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text("Data Apotek", 20, 10);

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

        doc.save("data-apotek.pdf");
    };

    const columns = [
        {field: "namaApotek", header: "Nama Apotek"},
        {field: "telepon", header: "Telepon"},
        {field: "alamat", header: "Alamat"},
        {field: "waktuOperasional", header: "Waktu Operasional"},
    ];

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
        <div className="min-h-screen flex flex-col gap-4 p-4 z-10">
            <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
                <ReusableTable
                    columns={columns}
                    data={data}
                    onDownload={handleDownload}
                    path={"dataApotekPuskesmas"}
                />
            </div>
        </div>
    );
};

export default DataApotek;
