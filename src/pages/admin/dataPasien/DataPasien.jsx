import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DataPasien = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pasien`,
          {
            headers: {
              "API-Key": `${Cookies.get("token")}`,
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>DataPasien</div>;
};

export default DataPasien;
