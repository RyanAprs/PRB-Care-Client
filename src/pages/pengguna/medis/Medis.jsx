import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { getAllPasienAktif } from "../../../services/PasienService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { ProgressSpinner } from "primereact/progressspinner";
import ReusableTable from "../../../components/rousableTable/RousableTable";

const Medis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPasienAktif();
        setData(response);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        HandleUnauthorizedPengguna(error.response, dispatch, navigate);
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  const columns = [
    { header: "Nomor Rekam Medis", field: "noRekamMedis" },
    { header: "Nama Lengkap", field: "pengguna.namaLengkap" },
    { header: "Puskesmas", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Berat Badan", field: "beratBadan" },
    { header: "Tinggi Badan", field: "tinggiBadan" },
    { header: "Tekanan Darah", field: "tekananDarah" },
    { header: "Denyut Nadi", field: "denyutNadi" },
    { header: "Hasil Lab", field: "hasilLab" },
    { header: "Hasil EKG", field: "hasilEkg" },
    { header: "Tanggal Periksa", field: "tanggalPeriksa" },
    { header: "Status", field: "status" },
  ];

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );
  return (
    <div className="md:py-2 py-8 dark:bg-fontDarkGreen">
      <div className="md:p-8 p-4 w-full h-screen">
        <div>
          <h1 className="text-2xl dark:text-white">Data Medis Anda:</h1>
        </div>
        <div className="row p-8 grid grid-cols-1 gap-6">
          <ReusableTable columns={columns} data={data} path={"pengguna"} />
        </div>
      </div>
    </div>
  );
};

export default Medis;
