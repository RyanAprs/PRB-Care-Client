import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";

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
    { header: "Nama Obat", field: "namaObat" },
    { header: "jumlah", field: "jumlah" },
    { header: "Nama Apotek", field: "adminApotek.namaApotek" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen ">
      <ReusableTable
        columns={columns}
        data={data}
        onDelete=""
        onUpdate=""
        onCreate=""
        statusOptions=""
      />
    </div>
  );
};

export default DataObat;
