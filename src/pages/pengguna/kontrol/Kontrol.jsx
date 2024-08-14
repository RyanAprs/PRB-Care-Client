import { useContext, useEffect, useState } from "react";
import { getAllKontrolBalik } from "../../../services/KontrolBalikService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Ban, CircleCheck, History, AlarmClock } from "lucide-react";

const Kontrol = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllKontrolBalik();
        setData(response);

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
    <div className="md:py-2 py-4 dark:bg-fontDarkGreen ">
      <div className="md:p-8 p-2 w-full min-h-screen">

        <div className="row p-8 grid grid-cols-1 gap-6">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card
                key={index}
                className={`bg-mainGreen shadow-lg rounded-xl`}
              >
                <div className="flex w-full text-xl px-4 justify-between items-center text-white">
                  <div className="flex flex-col gap-4 items-start justify-center">
                    <div className="flex">
                    <AlarmClock/> <h1 className="ml-2 font-poppins font-bold" >{item.tanggalKontrol}</h1>
                    </div>
                    
                    <h1 className="font-poppins ">
                      {item.pasien.adminPuskesmas.namaPuskesmas} - {item.pasien.adminPuskesmas.telepon} - {item.pasien.adminPuskesmas.alamat}
                    </h1>
                  </div>
                  <div className="flex items-center justify-center ">
                    {item.status === "menunggu" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <History />
                        <p className="font-poppins ">Menunggu</p>
                      </div>
                    )}
                    {item.status === "selesai" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <CircleCheck />
                        <p>Selesai</p>
                      </div>
                    )}
                    {item.status === "batal" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Ban />
                        <p>Batal</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center text-xl dark:text-white">
              Anda belum melakukan kontrol
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kontrol;
