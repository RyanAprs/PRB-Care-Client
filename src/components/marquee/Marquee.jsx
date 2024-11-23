import { useContext, useEffect, useState } from "react";
import ReactMarquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { getAllJadwalProlanisAktif } from "../../services/JadwalProlanisService";
import { HandleUnauthorizedPengguna } from "../../utils/HandleUnauthorized";
import { AuthContext } from "../../config/context/AuthContext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import ErrorConnection from "../errorConnection/ErrorConnection";

const Marquee = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [isConnectionError, setisConnectionError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJadwalProlanisAktif();
      setData(response);
      setLoading(false);
      setisConnectionError(false);
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
        setisConnectionError(true);
      }
      setLoading(false);
      HandleUnauthorizedPengguna(error.response, dispatch, navigate);
    }
  };

  const handleClickButton = () => {
    navigate("/prolanis");
  };

  useEffect(() => {
    fetchData();
  }, [token, navigate, dispatch]);

  if (loading) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays max-h-fit min-h-screen  flex justify-center items-center">
        <div className="p-8 w-full max-h-fit min-h-screen flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-2 ">
      <ReactMarquee gradient={false} speed={50} className="border-y-[3px] py-2">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div className="text-darkColor dark:text-whiteHover" key={index}>
              <h1 className="text-md ">
                {" "}
                | Jadwal Prolanis: {item.waktuMulai} - {item.waktuSelesai}
              </h1>
            </div>
          ))
        ) : (
          <div>Belum ada jadwal prolanis</div>
        )}
      </ReactMarquee>

      {data.length > 0 ? (
        <Button
          size="small"
          className="bg-mainGreen px-3 flex items-center justify-center"
          onClick={handleClickButton}
        >
          Selengkapnya
        </Button>
      ) : null}
    </div>
  );
};

export default Marquee;
