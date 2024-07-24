import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ReusableTableWithNestedData } from "../../../components/rousableTable/RousableTable";
import { timeStampToHuman } from "../../../utils/DateConverter";



const DataPasien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pasien`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formattedData = response.data.data.map((item) => ({
          ...item,
          tanggalPeriksa: timeStampToHuman(item.tanggalPeriksa),
        }));

        console.log(response.data.data);
        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center">
      <div className="p-4">
        <ReusableTableWithNestedData columns={columns} data={data} />
      </div>
    </div>
  );
};

export default DataPasien;
