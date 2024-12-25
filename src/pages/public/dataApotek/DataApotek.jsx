import { useContext, useEffect, useState } from "react";
import ReusableTable from "../../../components/reusableTable/ReusableTable.jsx";
import { ProgressSpinner } from "primereact/progressspinner";
import { AuthContext } from "../../../config/context/AuthContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getAllApotek } from "../../../services/ApotekService";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import { Button } from "primereact/button";
import {useNavigate} from "react-router-dom";
import EmptyData from "../../../components/emptyData/EmptyData";
import LoginRequired from "../../../components/loginRequired/LoginRequired";

const DataApotek = () => {
    const { token,dispatch } = useContext(AuthContext);
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isConnectionError, setIsConnectionError] = useState(false);
    const navigate = useNavigate();
    const customSort = (a, b) => {
        if (a.namaPuskesmas < b.namaPuskesmas) return -1;
        if (a.namaPuskesmas > b.namaPuskesmas) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllApotek();
            const sortedData = response.sort(customSort);
            setData(sortedData);
            setLoading(false);
            setLogin(true);
            setIsConnectionError(false);
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
                setIsConnectionError(true);
            } else if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    dispatch({ type: "LOGOUT" });
                    setIsConnectionError(false);
                    setLogin(false);
                }
            } else {
                console.error("An unexpected error occurred:", error);
            }

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, navigate, dispatch]);
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
        { field: "namaApotek", header: "Nama Apotek" },
        { field: "telepon", header: "Telepon" },
        { field: "alamat", header: "Alamat" },
        { field: "waktuOperasional", header: "Waktu Operasional" },
    ];

    if (loading) {
        return (
            <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
                <div className="p-8 w-full min-h-screen flex items-center justify-center bg-white dark:bg-blackHover rounded-xl">
                    <ProgressSpinner />
                </div>
            </div>
        );
    }



    if (isConnectionError) {
        return <ErrorConnection fetchData={fetchData} />;
    }
    if(!login){
        return (
            <LoginRequired />
        );
    }
    return (
        <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
            <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
            <div className="flex flex-col p-1 gap-4 min-h-screen max-h-fit">
                    {data.length > 0 ? (
                        <div className="row grid grid-cols-1 gap-6">
                            <ReusableTable
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

export default DataApotek;
