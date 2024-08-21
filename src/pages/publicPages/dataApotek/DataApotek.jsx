import { useContext, useEffect, useState } from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";
import img from "../../../assets/data_empty.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAllApotek } from "../../../services/ApotekService";

const DataApotek = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const customSort = (a, b) => {
    if (a.namaPuskesmas < b.namaPuskesmas) return -1;
    if (a.namaPuskesmas > b.namaPuskesmas) return 1;
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllApotek();
        const sortedData = response.sort(customSort);
        setData(sortedData);
        setLoading(false);
      } catch (error) {
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Aotek", 20, 10);

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
    { field: "namaApotek", header: "Nama Aptek" },
    { field: "telepon", header: "Telepon" },
    { field: "alamat", header: "Alamat" },
    { field: "waktuOperasional", header: "Waktu Operasional" },
  ];

  if (loading)
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
      <div className="p-8 w-full min-h-screen flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
        <ProgressSpinner />
      </div>
    </div>
    );

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
            <div className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
              <img src={img} className="md:w-80 w-64" alt="img" />
              Belum Ada Data
              <p className="font-medium text-xl">
                Data akan muncul di sini ketika tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataApotek;
