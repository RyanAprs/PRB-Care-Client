import {useContext, useEffect, useState} from "react";
import ReusableTable from "../../../components/reusableTable/ReusableTable.jsx";
import {getAllPuskesmas} from "../../../services/PuskesmasService";
import {ProgressSpinner} from "primereact/progressspinner";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../config/context/AuthContext";
import img from "../../../assets/data_empty.png";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import {Button} from "primereact/button";

const DataPuskesmas = () => {
    const {dispatch} = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [login, setLogin] = useState(false);
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();
    const [isConnectionError, setIsConnectionError] = useState(false);

    const customSort = (a, b) => {
        if (a.namaPuskesmas < b.namaPuskesmas) return -1;
        if (a.namaPuskesmas > b.namaPuskesmas) return 1;
        return 0;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAllPuskesmas();
            const sortedData = response.sort(customSort);
            setData(sortedData);
            setLoading(false);
            setLogin(true);
            setIsConnectionError(false);
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
                setIsConnectionError(true);
            }else if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    dispatch({ type: "LOGOUT" });
                    setIsConnectionError(false);
                    setLogin(false);
                }
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, navigate, dispatch]);

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text("Data Puskesmas", 20, 10);

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

        doc.save("data-puskesmas.pdf");
    };

    const columns = [
        {field: "namaPuskesmas", header: "Nama Puskesmas"},
        {field: "telepon", header: "Telepon"},
        {field: "alamat", header: "Alamat"},
        {field: "waktuOperasional", header: "Waktu Operasional"},
    ];

    if (loading)
        return (
            <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
                <div
                    className="p-8 w-full min-h-screen flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
                    <ProgressSpinner/>
                </div>
            </div>
        );
    if (isConnectionError) {
        return (
            <ErrorConnection fetchData={fetchData}/>
        );
    }
    if(!login){
        return (
            <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
                <div
                    className="p-8 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-blackHover rounded-xl">
                    <div
                        className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
                        Login Untuk Akses
                        <p className="font-medium text-xl">
                            Lakukan login terlebih dahulu untuk melihat data.
                        </p>
                        <Button
                            label="Login"
                            onClick={() => navigate("/pengguna/login")}
                            className="bg-mainGreen py-2 dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen  md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                        />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className=" md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
            <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl">
                <div className="flex flex-col p-1 gap-4  min-h-screen max-h-fit">
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

export default DataPuskesmas;
