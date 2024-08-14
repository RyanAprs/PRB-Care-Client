import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { getAllPasienAktif } from "../../../services/PasienService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "@nextui-org/react";

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

        console.log(response);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        HandleUnauthorizedPengguna(error.response, dispatch, navigate);
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );
  return (
    <div className="md:py-2 py-8 dark:bg-black">
      <div className="md:p-8 p-4 w-full h-screen">
        <div>
          <h1 className="text-2xl dark:text-white">Data Medis Anda:</h1>
        </div>
        <div className="row p-8 grid grid-cols-1 gap-6">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card key={index} className="shadow-lg rounded-xl bg-lightGreen">
                <div className="flex w-full text-xl p-8 justify-between items-center dark:text-black">
                  <div className="flex flex-col gap-4 items-start justify-center">
                    <h1>Nomor Rekam Medis: {item.noRekamMedis}</h1>
                    <h1>Nama: {item.pengguna.namaLengkap}</h1>
                    <h1>Puskesmas: {item.adminPuskesmas.namaPuskesmas}</h1>
                    <h1>Berat Badan: {item.beratBadan} kg</h1>
                    <h1>Tinggi Badan: {item.tinggiBadan} cm</h1>
                    <h1>Tekanan Darah: {item.tekananDarah}</h1>
                    <h1>Denyut Nadi: {item.denyutNadi}</h1>
                    <h1>Hasil Lab: {item.hasilLab}</h1>
                    <h1>Hasil Ekg: {item.hasilEkg}</h1>
                    <h1>Tanggal Periksa: {item.tanggalPeriksa}</h1>
                  </div>
                  <div className="flex items-center justify-center "></div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-xl dark:text-white">
              Anda belum melakukan Periksa
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medis;
