import { useContext, useEffect, useState } from "react";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Ban, CircleCheck, History, AlarmClock } from "lucide-react";
import { getAllPengambilanObat } from "../../../services/PengambilanObatService";

const Obat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const token = Cookies.get("token");

  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "diambil", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.tanggalPengambilan < b.tanggalPengambilan) return -1;
    if (a.tanggalPengambilan > b.tanggalPengambilan) return 1;

    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPengambilanObat();
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
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="md:py-2  dark:bg-fontDarkGreen h-screen">
      <div className="md:p-8  w-full h-full">
        <div className="row p-8 grid grid-cols-1 gap-6 overflow-y-auto h-full">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card key={index} className={`bg-mainGreen shadow-lg rounded-xl`}>
                <div className="flex w-full md:flex-row flex-col md:gap-0 gap-4 text-xl px-4 justify-between items-center text-white">
                  <div className="flex flex-col gap-4 items-start justify-center">
                    <div className="flex">
                      <AlarmClock />{" "}
                      <h1 className="ml-2 font-poppins font-bold">
                        {item.tanggalPengambilan}
                      </h1>
                    </div>
                    <h1 className="font-poppins">
                      {item.obat.adminApotek.namaApotek} -{" "}
                      {item.obat.adminApotek.telepon} -{" "}
                      {item.obat.adminApotek.alamat}
                    </h1>
                    <h1 className="font-poppins">
                      {item.obat.namaObat} - {item.jumlah}×
                    </h1>
                  </div>
                  <div className="flex items-center justify-center ">
                    {item.status === "menunggu" && (
                      <div className="font-poppins flex flex-col gap-2 items-center justify-center ">
                        <History />
                        <p>Menunggu</p>
                      </div>
                    )}
                    {item.status === "diambil" && (
                      <div className="font-poppins flex flex-col gap-2 items-center justify-center">
                        <CircleCheck />
                        <p>Selesai</p>
                      </div>
                    )}
                    {item.status === "batal" && (
                      <div className="font-poppins flex flex-col gap-2 items-center justify-center">
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
              Anda belum melakukan Pengambilan Obat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Obat;
