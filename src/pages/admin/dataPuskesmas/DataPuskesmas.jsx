// DataPuskesmas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../../../components/Table/Table";

const DataPuskesmas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
          {
            headers: {
              "API-Key": `${Cookies.get("token")}`,
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Nama Puskesmas",
        accessor: "namaPuskesmas",
      },
      {
        Header: "Telepon",
        accessor: "telepon",
      },
      {
        Header: "Alamat",
        accessor: "alamat",
      },
    ],
    []
  );

  const handleUpdate = (data) => {
    // Implement update logic here
    console.log("Update for:", data);
  };

  const handleDelete = async (data) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/${data.id}`,
        {
          headers: {
            "API-Key": `${Cookies.get("token")}`,
          },
        }
      );
      // Refresh the data after delete
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
        {
          headers: {
            "API-Key": `${Cookies.get("token")}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 overflow-auto">
      <Table
        columns={columns}
        data={data}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DataPuskesmas;
