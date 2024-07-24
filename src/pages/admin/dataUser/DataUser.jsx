import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ReusableTable } from "../../../components/rousableTable/RousableTable";

const DataUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { label: "Nama User", key: "namaLengkap" },
    { label: "Telepon", key: "telepon" },
    { label: "Telepon Keluarga", key: "teleponKeluarga" },
    { label: "Alamat", key: "alamat" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <ReusableTable
        columns={columns}
        data={data}
        // onEdit={handleModalUpdate}
        // onDelete={handleModalDelete}
      />
    </div>
  );
};

export default DataUser;
