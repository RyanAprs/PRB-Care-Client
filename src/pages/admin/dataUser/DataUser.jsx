import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import toast from "react-hot-toast";

const DataUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [datas, setDatas] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    telepon: "",
    teleponKeluarga: "",
    alamat: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const token = Cookies.get("token");
  const { address } = useContext(AddressContext);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [token]);

  useEffect(() => {
    const formattedAddress = [
      address.detail,
      address.desa,
      address.kecamatan,
      address.kabupaten,
      address.provinsi,
    ]
      .filter(Boolean)
      .join(", ");

    setDatas((prev) => ({
      ...prev,
      alamat: formattedAddress,
    }));
  }, [address]);

  const handleModalCreate = () => {
    setDatas({
      namaLengkap: "",
      username: "",
      password: "",
      telepon: "",
      teleponKeluarga: "",
      alamat: "",
    });
    setIsEditMode(false);
    onOpen();
  };

  const handleCreate = async () => {
    setErrors("");
    if (
      !datas.namaLengkap ||
      !datas.username ||
      !datas.password ||
      !datas.telepon ||
      !datas.teleponKeluarga ||
      !datas.alamat
    ) {
      setErrors("Pastikan semua kolom terisi. Mohon periksa kembali.");
      return;
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          datas,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          onClose();
          toast.success("Data pengguna berhasil ditambahkan");
          const dataResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(dataResponse.data.data);
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setErrors("Data gagal ditambahkan. Mohon periksa kembali.");
              break;
            case 401:
              setErrors(
                "Anda tidak memiliki akses untuk menambah data. Silahkan login terlebih dahulu."
              );
              break;
            case 409:
              setErrors(
                "Username atau nomor telepon sudah digunakan. Mohon periksa kembali."
              );
              break;
            case 500:
              setErrors(
                "Terjadi kesalahan pada server. Mohon coba lagi nanti."
              );
              break;
            default:
              setErrors("Terjadi kesalahan yang tidak terduga.");
              break;
          }
        } else {
          setErrors("Terjadi kesalahan jaringan. Mohon coba lagi nanti.");
        }
      }
    }
  };

  const handleModalUpdate = async (data) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataResponse = response.data.data;
      console.log(dataResponse);
      if (response.status === 200) {
        setDatas({
          namaLengkap: dataResponse.namaLengkap,
          username: dataResponse.username,
          password: "",
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
          teleponKeluarga: dataResponse.teleponKeluarga,
        });
        setCurrentId(data.id);
      }
    } catch (error) {
      console.log(error);
    }
    onOpen();
    setIsEditMode(true);
  };

  const handleUpdate = async () => {
    setErrors("");

    if (
      !datas.namaLengkap ||
      !datas.telepon ||
      !datas.teleponKeluarga ||
      !datas.alamat
    ) {
      setErrors("Pastikan semua kolom terisi. Mohon periksa kembali.");
      return;
    } else {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/${currentId}`,
          datas,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          onClose();
          toast.success("Data Pengguna berhasil diperbarui");
          const dataResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(dataResponse.data.data);
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setErrors("Data gagal diperbarui. Mohon periksa kembali.");
              break;
            case 401:
              setErrors(
                "Anda tidak memiliki akses untuk memperbarui data. Silahkan login terlebih dahulu."
              );
              break;
            case 409:
              setErrors(
                "Username sudah digunakan atau nomor telepon sudah digunakan. Mohon periksa kembali."
              );
              break;
            case 500:
              setErrors(
                "Terjadi kesalahan pada server. Mohon coba lagi nanti."
              );
              break;
            default:
              setErrors("Terjadi kesalahan yang tidak terduga.");
              break;
          }
        } else {
          setErrors("Terjadi kesalahan jaringan. Mohon coba lagi nanti.");
        }
      }
    }
  };

  const handleModalDelete = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.namaLengkap);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/${currentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        onDeleteClose();
        toast.success("Data Pengguna berhasil dihapus.");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      }
    } catch (error) {
      if (error.response) {
        onDeleteClose();
        switch (error.response.status) {
          case 400:
            toast.error("Data gagal dihapus. Mohon periksa kembali.");
            break;
          case 401:
            toast.error(
              "Anda tidak memiliki akses untuk menambah data. Silahkan login terlebih dahulu."
            );
            break;
          case 404:
            toast.error("Data tidak ditemukan");
            break;
          case 409:
            toast.error(
              "Gagal menghapus data. Pengguna ini masih terkait dengan data lain. Mohon periksa kembali"
            );
            break;
          case 500:
            toast.error(
              "Terjadi kesalahan pada server. Mohon coba lagi nanti."
            );
            break;
          default:
            toast.error("Terjadi kesalahan, coba lagi nanti.");
            break;
        }
      } else {
        toast.error("Terjadi kesalahan jaringan. Mohon coba lagi nanti.");
      }
    }
  };

  const columns = [
    { field: "namaLengkap", header: "Nama Pengguna" },
    { field: "telepon", header: "Telepon" },
    { field: "teleponKeluarga", header: "Telepon Keluarga" },
    { field: "alamat", header: "Alamat" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4 z-10 ">
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCreate={handleModalCreate}
        />
      </div>

      <Modal
        size="lg"
        className="max-h-screen"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                {isEditMode ? "Edit Data Pengguna" : "Tambah Data Pengguna"}
              </ModalHeader>
              <ModalBody className="overflow-auto">
                {errors && <p className="text-red-500">{errors}</p>}
                <Input
                  type="text"
                  label="Nama Pengguna"
                  variant="bordered"
                  value={datas.namaLengkap}
                  onChange={(e) =>
                    setDatas((prev) => ({
                      ...prev,
                      namaLengkap: e.target.value,
                    }))
                  }
                />
                <Input
                  type="text"
                  label="Username Pengguna"
                  variant="bordered"
                  value={datas.username}
                  onChange={(e) =>
                    setDatas((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <Input
                  type="password"
                  label="Password Pengguna"
                  variant="bordered"
                  value={datas.password}
                  onChange={(e) =>
                    setDatas((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
                <span className="font-light -mt-4">
                  {isEditMode
                    ? "Jika password pengguna tidak diubah, biarkan kosong."
                    : "*password harus kombinasi huruf kecil, kapital, angka, dansimbol."}
                </span>
                <Input
                  label="Nomor Telepon Pengguna"
                  variant="bordered"
                  value={datas.telepon}
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, telepon: e.target.value }))
                  }
                />
                <Input
                  label="Nomor Telepon Keluarga Pengguna"
                  variant="bordered"
                  value={datas.teleponKeluarga}
                  onChange={(e) =>
                    setDatas((prev) => ({
                      ...prev,
                      teleponKeluarga: e.target.value,
                    }))
                  }
                />

                <h1>Alamat Pengguna</h1>
                <DynamicAddress />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  variant="flat"
                  onClick={isEditMode ? handleUpdate : handleCreate}
                >
                  {isEditMode ? "Update" : "Buat"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteClose}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Konfirmasi Hapus</ModalHeader>
          <ModalBody>
            Apakah anda yakin ingin menghapus data {currentName} ?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onDeleteClose}>
              Batal
            </Button>
            <Button color="primary" onPress={handleDelete}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DataUser;
