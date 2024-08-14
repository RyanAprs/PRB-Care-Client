import { useContext, useEffect, useState } from "react";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Ban, CircleCheck, History } from "lucide-react";
import { getAllPengambilanObat } from "../../../services/PengambilanObatService";

const Obat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPengambilanObat();
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
    <div className="md:py-2 py-8  dark:bg-black">
      <div className="md:p-8 p-4  w-full min-h-screen">
        <div>
          <h1 className="text-2xl dark:text-white">Pengambilan Obat Anda:</h1>
        </div>
        <div className="row p-8 grid grid-cols-1 gap-6">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Card
                key={index}
                className={`${
                  item.status === "diambil" ? "bg-green-300" : ""
                } ${item.status === "batal" ? "bg-red-300" : ""} ${
                  item.status === "menunggu" ? "bg-yellow-100" : ""
                } shadow-lg rounded-xl`}
              >
                <div className="flex w-full text-xl p-8 justify-between items-center dark:text-black">
                  <div className="flex flex-col gap-4 items-start justify-center">
                    <h1>{item.pasien.pengguna.namaLengkap}</h1>
                    <h1>
                      Tempat Pengambilan: {item.obat.adminApotek.namaApotek}
                    </h1>
                    <h1>Obat: {item.obat.namaObat}</h1>
                    <h1>Jumlah: {item.jumlah}</h1>
                    <h1>Tanggal Pengambilan: {item.tanggalPengambilan}</h1>
                  </div>
                  <div className="flex items-center justify-center ">
                    {item.status === "menunggu" && (
                      <div className="flex flex-col gap-2 items-center justify-center ">
                        <History />
                        <p>Menunggu</p>
                      </div>
                    )}
                    {item.status === "diambil" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <CircleCheck />
                        <p>Berhasil</p>
                      </div>
                    )}
                    {item.status === "batal" && (
                      <div className="flex flex-col gap-2 items-center justify-center">
                        <Ban />
                        <p>Gagal</p>
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
