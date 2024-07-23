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
  const token = Cookies.get("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useContext(AddressContext);

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
    setDatas((prev) => ({
      ...prev,
      alamat: `${address.detail}, ${address.desa}, ${address.kecamatan}, ${address.kabupaten}, ${address.provinsi}`,
    }));
  }, [address]);

  const handleModalCreate = () => {
    onOpen();
  };

  const handleCreate = async () => {
    setErrors("");
    if (!datas.username || !datas.password || !datas.telepon) {
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
              setErrors("Username sudah digunakan. Mohon periksa kembali.");
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

  const handleUpdate = async (data) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/${data.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (data) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <ReusableTable
        columns={columns}
        data={data}
        dataTitle="Puskesmas"
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onCreate={handleModalCreate}
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
                Buat Puskesmas
              </ModalHeader>
              <ModalBody className="overflow-auto">
                {errors && <p className="text-red-500">{errors}</p>}
                <Input
                  type="text"
                  label="Nama Puskesmas"
                  variant="bordered"
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
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  label="Password Puskesmas"
                  variant="bordered"
                  onChange={(e) =>
                    setDatas((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  label="Nomor Telepon Puskesmas"
                  variant="bordered"
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
                <Button variant="flat" onClick={handleCreate}>
                  Buat
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
