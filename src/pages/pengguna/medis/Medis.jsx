import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import Cookies from "js-cookie";
import { getAllPasienAktif } from "../../../services/PasienService";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized";
import { ProgressSpinner } from "primereact/progressspinner";

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
    <div className="flex items-center justify-center h-screen dark:bg-black dark:text-white">
      Medis
    </div>
  );
};

export default Medis;
