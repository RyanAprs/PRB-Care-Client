import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import { getAllPasienAktif } from "../../../services/PasienService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { ProgressSpinner } from "primereact/progressspinner";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import img from "../../../assets/data_empty.png";

const Medis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPasienAktif();
        setData(response || []);  
        setLoading(false);
      } catch (error) {
        setLoading(false);
        HandleUnauthorizedPengguna(error.response, dispatch, navigate);
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Medis", 20, 10);

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

  const columns = [
    { header: "Nomor Rekam Medis", field: "noRekamMedis" },
    { header: "Nama Puskesmas", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Alamat Puskesmas", field: "adminPuskesmas.alamat" },
    { header: "Telepon Puskesmas", field: "adminPuskesmas.telepon" },
    { header: "Berat Badan", field: "beratBadan" },
    { header: "Tinggi Badan", field: "tinggiBadan" },
    { header: "Tekanan Darah", field: "tekananDarah" },
    { header: "Denyut Nadi", field: "denyutNadi" },
    { header: "Hasil Lab", field: "hasilLab" },
    { header: "Hasil EKG", field: "hasilEkg" },
    { header: "Tanggal Periksa", field: "tanggalPeriksa" },
    { header: "Status", field: "status" },
  ];

  if (loading) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
        <div className="p-8 w-full h-full flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className=" md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen">
      <div className="p-8 w-full h-full bg-white dark:bg-blackHover rounded-xl">
        <div className="flex flex-col p-1 gap-4 overflow-y-auto h-full">
      {data.length > 0 ? (
          <div className="row grid grid-cols-1 gap-6">
            <ReusableTable
              columns={columns}
              data={data}
              onDownload={handleDownload}
              path={"pengguna"}
            />
          </div>
        
      ) : (
        <div className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
              <img src={img} className="md:w-80 w-64" alt="img" />
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
