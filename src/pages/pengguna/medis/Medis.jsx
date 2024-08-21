import { useContext, useEffect, useState } from "react";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import img from "../../../assets/data_empty.png";
import { getAllPasienAktif } from "../../../services/PasienService";

const Medis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "selesai", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.pasien.tanggalKontrol < b.pasien.tanggalKontrol) return -1;
    if (a.pasien.tanggalKontrol > b.pasien.tanggalKontrol) return 1;

    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPasienAktif();
        console.log(response);

        const sortedData = response.sort(customSort);
        setData(sortedData);
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
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
        <div className="p-8 w-full h-full flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );

  return (
    <div className=" md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen">
      <div className="p-8 w-full h-full  bg-white dark:bg-blackHover rounded-xl">
        <h1 className="font-poppins text-xl md:text-start text-center ">
          Data Medis
        </h1>
        <div className="flex flex-col p-1 gap-6 overflow-y-auto h-full">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card
                key={index}
                className={`bg-lightGreen dark:bg-mainGreen h-fit rounded-xl`}
              >
                <div className="flex w-full flex-col md:gap-0 gap-4 text-xl px-4 justify-start items-start text-white">
                  <div className="w-full flex flex-col gap-2 md:gap-4 ">
                    <div className="md:w-1/2 w-full flex flex-col md:flex-row md:justify-between">
                      <h1>No Rekam Medis :</h1>
                      <h1>{item.noRekamMedis}</h1>
                    </div>
                    <div className="md:w-1/2 w-full flex gap-2 md:justify-between items-start">
                      <h1>Nama : </h1>
                      <h1>{item.pengguna.namaLengkap}</h1>
                    </div>
                    <div className="md:w-1/2 w-full flex gap-2 md:justify-between items-start">
                      <h1>Puskesmas :</h1>
                      <h1>{item.adminPuskesmas.namaPuskesmas}</h1>
                    </div>
                    <div className="md:w-1/2 w-full flex gap-2 md:justify-between items-start">
                      <h1>Tanggal Daftar :</h1>
                      <h1>{item.tanggalDaftar}</h1>
                    </div>
                  </div>
                </div>
              </Card>
            ))
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

export default Medis;
