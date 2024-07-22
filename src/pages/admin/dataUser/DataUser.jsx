import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DataUser = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
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
  return <div>DataUser</div>;
};

export default DataUser;
