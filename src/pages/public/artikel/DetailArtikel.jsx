import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtikelById } from "../../../services/ArtikelService";
import { AuthContext } from "../../../config/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import NotFound from "../../NotFound";
import { convertUnixToHuman } from "../../../utils/DateConverter";

const DetailArtikel = () => {
  const { id } = useParams();
  const { token, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [data, setData] = useState({});
  const [isNotfound, setIsNotFound] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getArtikelById(id);
      setData(response);
      setLoading(false);
      setIsConnectionError(false);
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "EAI_AGAIN" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "ECONNRESET" ||
        error.code === "EPIPE"
      ) {
        setIsConnectionError(true);
      } else if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          dispatch({ type: "LOGOUT" });
          setIsConnectionError(false);
        } else if (error.response.status === 404) {
          setIsNotFound(true);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen flex justify-center items-center">
        <div className="p-8 w-full min-h-screen flex items-center justify-center bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (isNotfound) {
    return <NotFound />;
  }

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const tanggal = convertUnixToHuman(data.tanggalPublikasi);

  return (
    <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen max-h-fit">
      <div className="min-h-screen max-h-fit bg-white dark:bg-blackHover rounded-xl p-8 md:p-20">
        <div className="flex flex-col items-start justify-center gap-4 md:gap-8">
          <div className="flex flex-col gap-2 md:gap-4">
            <h1 className="md:text-6xl text-3xl font-semibold">{data.judul}</h1>
            <div className="flex gap-2 text-lg md:text-xl">
              <p>{data.adminPuskesmas.namaPuskesmas}</p>
              <p>-</p>
              <p>{tanggal}</p>
            </div>
          </div>
          <p className="text-lg md:text-xl">{data.isi}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailArtikel;
