import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ReusableTableWithNestedData } from "../../../components/rousableTable/RousableTable";

const DataObat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/obat`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { label: "Nama Apotek", key: "adminApotek.namaApotek" },
    { label: "Nama Obat", key: "namaObat" },
    { label: "jumlah", key: "jumlah" },
  ];

  if (loading) return <p>Loading...</p>;

  return <ReusableTableWithNestedData columns={columns} data={data} />;
};

export default DataObat;
