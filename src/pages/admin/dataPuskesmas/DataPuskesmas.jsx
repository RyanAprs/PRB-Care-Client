import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { AddressContext } from "../../../config/context/AdressContext";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import toast from "react-hot-toast";

const DataPuskesmas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [datas, setDatas] = useState({
    namaPuskesmas: "",
    username: "",
    password: "",
    alamat: "",
    telepon: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const token = Cookies.get("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useContext(AddressContext);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
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
      namaPuskesmas: "",
      username: "",
      password: "",
      alamat: "",
      telepon: "",
    });
    setIsEditMode(false);
    onOpen();
  };

  const handleCreate = async () => {
    setErrors("");
    if (
      !datas.namaPuskesmas ||
      !datas.username ||
      !datas.password ||
      !datas.telepon ||
      !datas.alamat
    ) {
      setErrors("Pastikan semua kolom terisi. Mohon periksa kembali.");
      return;
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
          datas,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          onClose();
          toast.success("Data puskesmas berhasil ditambahkan");
          const dataResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
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

  const handleUpdate = async () => {
    setErrors("");

    if (!datas.namaPuskesmas || !datas.telepon || !datas.alamat) {
      setErrors("Pastikan semua kolom terisi. Mohon periksa kembali.");
      return;
    } else {
      try {
        const response = await axios.patch(
          `${
            import.meta.env.VITE_API_BASE_URI
          }/api/admin-puskesmas/${currentId}`,
          datas,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          onClose();
          toast.success("Data puskesmas berhasil diperbarui");
          const dataResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
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

  const handleModalUpdate = async (data) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataResponse = response.data.data;
      if (response.status === 200) {
        setDatas({
          namaPuskesmas: dataResponse.namaPuskesmas,
          username: dataResponse.username,
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
        });
        setCurrentId(data.id);
      }
    } catch (error) {
      console.log(error);
    }
    onOpen();
    setIsEditMode(true);
  };

  const handleModalDelete = async (data) => {
    setCurrentId(data.id);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/${currentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        onDeleteClose();
        toast.success("Data Puskesmas berhasil dihapus.");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
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
              "Gagal menghapus data.Admin puskesmas ini masih terkait dengan data lain. Mohon periksa kembali"
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
    { name: "Nama Puskesmas", uid: "namaPuskesmas", sortable: true },
    { name: "Telepon", uid: "telepon", sortable: true },
    { name: "Alamat", uid: "alamat", sortable: true },
    { name: "Aksi", uid: "actions" },
  ];

  const initialVisibleColumns = [
    "id",
    "namaPuskesmas",
    "telepon",
    "alamat",
    "actions",
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <ReusableTable
        columns={columns}
        data={data}
        dataTitle="Puskesmas"
        onDelete={handleModalDelete}
        onUpdate={handleModalUpdate}
        onCreate={handleModalCreate}
        initialVisibleColumns={initialVisibleColumns}
      />

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
                {isEditMode ? "Edit Puskesmas" : "Buat Puskesmas"}
              </ModalHeader>
              <ModalBody className="overflow-auto">
                {errors && <p className="text-red-500">{errors}</p>}
                <Input
                  type="text"
                  label="Nama Puskesmas"
                  variant="bordered"
                  value={datas.namaPuskesmas}
                  onChange={(e) =>
                    setDatas((prev) => ({
                      ...prev,
                      namaPuskesmas: e.target.value,
                    }))
                  }
                />
                <Input
                  type="text"
                  label="Username Puskesmas"
                  variant="bordered"
                  value={datas.username}
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  label="Password Puskesmas"
                  variant="bordered"
                  value={datas.password}
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <span className="font-light -mt-4">
                  *password harus kombinasi huruf kecil, kapital, angka, dan
                  simbol.
                </span>
                <Input
                  type="number"
                  label="Nomor Telepon Puskesmas"
                  variant="bordered"
                  value={datas.telepon}
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, telepon: e.target.value }))
                  }
                />
                <h1>Alamat Puskesmas</h1>
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
        size="lg"
        className="max-h-screen"
        isOpen={isDeleteModalOpen}
        onClose={onDeleteClose}
      >
        <ModalContent>
          {(onDeleteClose) => (
            <>
              <ModalBody className="overflow-auto">
                Apakah anda yakin ingin menghapus data ini?
              </ModalBody>
              <ModalFooter>
                <Button color="flat" onPress={onDeleteClose}>
                  Batal
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DataPuskesmas;
