import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const DataPasien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const [visible, setVisible] = useState(false);
  const [adminPuskesmas, setAdminPuskesmas] = useState([]);
  const [pengguna, setPengguna] = useState([]);
  const [datas, setDatas] = useState({
    noRekamMedis: "",
    idAdminPuskesmas: "",
    idPengguna: "",
    beratBadan: "",
    tinggiBadan: "",
    tekananDarah: "",
    denyutNadi: "",
    hasilLab: "",
    hasilEkg: "",
    tanggalPeriksa: "",
  });

  const handleModalCreate = () => {
    setVisible(true);
  };

  const handleCreate = async () => {
    console.log(datas);
    setVisible(false);
  };

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
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchDataAdminPuskesmas = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdminPuskesmas(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchDataPengguna = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPengguna(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDataPengguna();
    fetchDataAdminPuskesmas();
    fetchData();
  }, [token]);

  const columns = [
    { header: "Nomor Rekam Medis", field: "noRekamMedis" },
    { header: "Nama Lengkap", field: "pengguna.namaLengkap" },
    { header: "Nama Puskesmas", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Berat Badan", field: "beratBadan" },
    { header: "Tinggi Badan", field: "tinggiBadan" },
    { header: "Tekanan Darah", field: "tekananDarah" },
    { header: "Denyut Nadi", field: "denyutNadi" },
    { header: "Hasil Lab", field: "hasilLab" },
    { header: "Hasil EKG", field: "hasilEkg" },
    { header: "Tanggal Periksa", field: "tanggalPeriksa" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "aktif", label: "Aktif" },
    { key: "tidak aktif", label: "Tidak Aktif" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4 z-10 ">
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onDelete=""
          onEdit=""
          statuses={statuses}
        />
      </div>

      <Dialog
        header="Tambah Data Pasien"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <Dropdown
            value={datas.idAdminPuskesmas}
            options={adminPuskesmas}
            optionLabel="namaPuskesmas"
            placeholder="Pilih Puskesmas"
            className="bg-gray-200 p-2 rounded"
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                idAdminPuskesmas: e.value,
              }))
            }
          />
          <Dropdown
            value={datas.idPengguna}
            options={pengguna}
            optionLabel="namaLengkap"
            placeholder="Pilih Pengguna"
            className="bg-gray-200 p-2 rounded"
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                idPengguna: e.value,
              }))
            }
          />
          <InputText
            type="text"
            placeholder="Nomor Rekam Medis"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.noRekamMedis}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                noRekamMedis: e.target.value,
              }))
            }
          />
          <InputText
            type="number"
            placeholder="Tinggi Badan"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.tinggiBadan}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                tinggiBadan: e.target.value,
              }))
            }
          />
          <InputText
            type="number"
            placeholder="Berat Badan"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.beratBadan}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                beratBadan: e.target.value,
              }))
            }
          />
          <InputText
            type="text"
            placeholder="Tekanan Darah"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.tekananDarah}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                tekananDarah: e.target.value,
              }))
            }
          />
          <InputText
            type="number"
            placeholder="Denyut Nadi"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.denyutNadi}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                denyutNadi: e.target.value,
              }))
            }
          />
          <InputText
            type="text"
            placeholder="Hasil Lab"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.hasilLab}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                hasilLab: e.target.value,
              }))
            }
          />
          <InputText
            type="text"
            placeholder="Hasil EKG"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.hasilEkg}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                hasilEkg: e.target.value,
              }))
            }
          />
          <InputText
            type="date"
            placeholder="tanggal periksa"
            className="p-inputtext-lg p-4 bg-gray-200 rounded"
            value={datas.tanggalPeriksa}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                tanggalPeriksa: e.target.value,
              }))
            }
          />

          <Button
            label="Simpan"
            className="p-4 bg-lightGreen text-white rounded-xl hover:mainGreen transition-all"
            onClick={handleCreate}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DataPasien;
