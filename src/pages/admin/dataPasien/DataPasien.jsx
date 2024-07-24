import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ReusableTableWithNestedData } from "../../../components/rousableTable/RousableTable";

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
        setData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { label: "Nomor Rekam Medis", key: "noRekamMedis" },
    { label: "Nama Lengkap", key: "pengguna.namaLengkap" },
    { label: "Nama Puskesmas", key: "adminPuskesmas.namaPuskesmas" },
    { label: "Berat Badan", key: "beratBadan" },
    { label: "Tinggi Badan", key: "tinggiBadan" },
    { label: "Tekanan Darah", key: "tekananDarah" },
    { label: "Denyut Nadi", key: "denyutNadi" },
    { label: "Hasil Lab", key: "hasilLab" },
    { label: "Hasil EKG", key: "hasilEkg" },
    { label: "Tanggal Periksa", key: "tanggalPeriksa" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-4">
          <ReusableTableWithNestedData columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};

export default DataPasien;
