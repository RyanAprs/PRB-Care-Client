import { useContext, useEffect, useState } from "react";
import { getAllKontrolBalik } from "../../../services/KontrolBalikService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Ban, CircleCheck, History, AlarmClock } from "lucide-react";
import img from "../../../assets/data_empty.png";

const Kontrol = () => {
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
        const response = await getAllKontrolBalik();
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
        <div className="flex flex-col p-1  gap-6 overflow-y-auto h-full">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card
                key={index}
                className={`bg-lightGreen dark:bg-mainGreen h-fit rounded-xl`}
              >
                <div className="flex w-full md:flex-row flex-col md:gap-0 gap-4 text-xl px-4 justify-between items-center text-white">
                  <div className="flex flex-col gap-4 items-center md:items-start justify-center">
                    <div className="flex md:mx-0 mx-auto">
                      <AlarmClock />{" "}
                      <h1 className="ml-2 font-poppins font-bold">
                        {item.tanggalKontrol}
                      </h1>
                    </div>

                    <h1 className="font-poppins md:text-start text-center ">
                      {item.pasien.adminPuskesmas.namaPuskesmas},{" "}
                      {item.pasien.adminPuskesmas.telepon},{" "}
                      {item.pasien.adminPuskesmas.alamat}.
                    </h1>
                  </div>
                  <div className="flex items-center justify-center ">
                    {item.status === "menunggu" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <History size={35} />
                        <p className="font-poppins ">Menunggu</p>
                      </div>
                    )}
                    {item.status === "selesai" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <CircleCheck size={35} />
                        <p>Selesai</p>
                      </div>
                    )}
                    {item.status === "batal" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Ban size={35} />
                        <p>Batal</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
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

export default Kontrol;
