import { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlignLeft,
  LayoutGrid,
  Hospital,
  HousePlus,
  Lock,
  LogOut,
  Pill,
  ShoppingCart,
  Stethoscope,
  User,
  UserRoundPlus,
  Settings2,
} from "lucide-react";

import icon from "../../assets/prbcare.svg";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { AuthContext } from "../../config/context/AuthContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { superAdminChangePasswordSchema } from "../../validations/SuperAdminSchema";
import { ZodError } from "zod";
import {
  handleApiError,
  handleChangePasswordError,
} from "../../utils/ApiErrorHandlers";
import { updatePassword } from "../../services/SuperAdminService";
import Cookies from "js-cookie";
import {
  getCurrentAdminPuskesmas,
  updateCurrentPuskesmas,
  updatePasswordPuskesmas,
} from "../../services/PuskesmasService";
import {
  getCurrentAdminApotek,
  updateCurrentApotek,
  updatePasswordApotek,
} from "../../services/ApotekService";
import DynamicAddress from "../dynamicAddress/DynamicAddress";
import {
  HandleUnauthorizedAdminApotek,
  HandleUnauthorizedAdminPuskesmas,
} from "../../utils/HandleUnauthorized";
import { apotekUpdateCurrentSchema } from "../../validations/ApotekSchema";
import { puskesmasUpdateCurrentSchema } from "../../validations/PuskesmasSchema";
import { AddressContext } from "../../config/context/AdressContext";
import { useModalUpdate } from "../../config/context/ModalUpdateContext";

const NavbarAdmin = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const [visibleDetailProfile, setVisibleDetailProfile] = useState(false);
  const [visibleUpdateProfile, setVisibleUpdateProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [dataPassword, setDataPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const role = Cookies.get("role");
  const { dispatch } = useContext(AuthContext);
  const [isApotekUpdate, setIsApotekUpdate] = useState(false);
  const [dataApotek, setDataApotek] = useState({
    namaApotek: "",
    telepon: "",
    alamat: "",
  });
  const [dataPuskesmas, setDataPuskesmas] = useState({
    namaPuskesmas: "",
    telepon: "",
    alamat: "",
  });
  const [prevAddress, setPrevAddress] = useState({});

  const { address } = useContext(AddressContext);

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

    if (isApotekUpdate) {
      setDataApotek((prev) => ({
        ...prev,
        alamat: formattedAddress,
      }));
    } else {
      setDataPuskesmas((prev) => ({
        ...prev,
        alamat: formattedAddress,
      }));
    }
  }, [address, isApotekUpdate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      overlayRef.current &&
      !overlayRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
      const themeUrl = new URL(
        "primereact/resources/themes/saga-green/theme.css",
        import.meta.url
      ).href;
      themeLink.href = themeUrl;
      document.body.classList.remove('dark');
    }
    

    if (role === "admin") {
      navigate("/admin/login");
    } else if (role === "nakes") {
      navigate("/puskesmas/login");
    } else if (role === "apoteker") {
      navigate("/apotek/login");
    }
  };

  const Sidebar = () => (
    <div
      ref={sidebarRef}
      style={{ willChange: "transform" }}
      className={`fixed top-0 left-0 dark:bg-darkGreen bg-mainGreen text-white p-4 flex-col transition-transform duration-500 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-80 overflow-y-auto z-50 gap-8 h-full dark:border-blackHover`}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col border-b border-lightGreen font-bold text-lg mb-4 items-center justify-center">
          <img src={icon} alt="LOGO PRB CARE" className="w-auto h-20" />
          <h1>PRB Care</h1>
        </div>
        <div className="flex flex-col h-full justify-around">
          {role === "admin" && (
            <div className="flex flex-col h-full gap-2">
              <Link
                to="/admin/beranda"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/beranda"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <LayoutGrid />
                <h1>Beranda</h1>
              </Link>
              <Link
                to="/admin/data-puskesmas"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-puskesmas"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <Hospital />
                <h1>Puskesmas</h1>
              </Link>
              <Link
                to="/admin/data-apotek"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-apotek"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <HousePlus />
                <h1>Apotek</h1>
              </Link>
              <Link
                to="/admin/data-pengguna"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-pengguna"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <User />
                <h1>Pengguna</h1>
              </Link>
              <Link
                to="/admin/data-pasien"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-pasien"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <UserRoundPlus />
                <h1>Pasien</h1>
              </Link>
              <Link
                to="/admin/data-obat"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-obat"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <Pill />
                <h1>Obat</h1>
              </Link>
              <Link
                to="/admin/data-kontrol-balik"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-kontrol-balik"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <Stethoscope />
                <h1>Kontrol Balik</h1>
              </Link>
              <Link
                to="/admin/data-pengambilan-obat"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/admin/data-pengambilan-obat"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <ShoppingCart />
                <h1>Pengambilan Obat</h1>
              </Link>
            </div>
          )}
          {role === "nakes" && (
            <div className="flex flex-col h-full justify-start gap-2">
              <Link
                to="/puskesmas/beranda"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/puskesmas/beranda"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <LayoutGrid />
                <h1>Beranda</h1>
              </Link>
              <Link
                to="/puskesmas/data-pasien"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/puskesmas/data-pasien"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <UserRoundPlus />
                <h1>Pasien</h1>
              </Link>
              <Link
                to="/puskesmas/data-kontrol-balik"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/puskesmas/data-kontrol-balik"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <Stethoscope />
                <h1>Kontrol Balik</h1>
              </Link>
              <Link
                to="/puskesmas/data-pengambilan-obat"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/puskesmas/data-pengambilan-obat"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <ShoppingCart />
                <h1>Pengambilan Obat</h1>
              </Link>
            </div>
          )}
          {role === "apoteker" && (
            <div className="flex flex-col h-full justify-start gap-2">
              <Link
                to="/apotek/beranda"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/apotek/beranda"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <LayoutGrid />
                <h1>Beranda</h1>
              </Link>
              <Link
                to="/apotek/data-obat"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/apotek/data-obat"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <Pill />
                <h1>Obat</h1>
              </Link>
              <Link
                to="/apotek/data-pengambilan-obat"
                className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                  location.pathname === "/apotek/data-pengambilan-obat"
                    ? "bg-lightGreen dark:bg-mainGreen"
                    : ""
                } rounded transition-all`}
              >
                <ShoppingCart />
                <h1>Pengambilan Obat</h1>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const handleDetailProfileModal = async () => {
    setVisibleDetailProfile(true);
    if (role === "nakes") {
      setIsApotekUpdate(false);
      try {
        const dataResponse = await getCurrentAdminPuskesmas();
        if (dataResponse) {
          setDataPuskesmas({
            namaPuskesmas: dataResponse.namaPuskesmas,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
          });
          setVisible(false);
        }
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
    if (role === "apoteker") {
      setIsApotekUpdate(true);
      try {
        const dataResponse = await getCurrentAdminApotek();
        if (dataResponse) {
          setDataApotek({
            namaApotek: dataResponse.namaApotek,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
          });
          setVisible(false);
        }
      } catch (error) {
        HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleUpdateProfileModal = async () => {
    setVisibleUpdateProfile(true);
    if (role === "nakes") {
      setIsApotekUpdate(false);
      try {
        const dataResponse = await getCurrentAdminPuskesmas();
        setPrevAddress(dataResponse.alamat);
        if (dataResponse) {
          setDataPuskesmas({
            namaPuskesmas: dataResponse.namaPuskesmas,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
          });
          setVisibleDetailProfile(false);
        }
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
    if (role === "apoteker") {
      setIsApotekUpdate(true);
      try {
        const dataResponse = await getCurrentAdminApotek();
        setPrevAddress(dataResponse.alamat);
        if (dataResponse) {
          setDataApotek({
            namaApotek: dataResponse.namaApotek,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
          });
          setVisibleDetailProfile(false);
        }
      } catch (error) {
        HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const { setIsUpdated } = useModalUpdate();

  const handleUpdateProfile = async () => {
    try {
      if (isApotekUpdate) {
        const updatedDatas = {
          ...dataApotek,
          alamat: dataApotek.alamat || prevAddress,
        };
        apotekUpdateCurrentSchema.parse(updatedDatas);

        const response = await updateCurrentApotek(updatedDatas);
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Berhasil",
            detail: "Data Apotek diperbarui",
            life: 3000,
          });

          setIsUpdated(true);
          setVisibleUpdateProfile(false);
        }
      } else {
        const updatedDatas = {
          ...dataPuskesmas,
          alamat: dataPuskesmas.alamat || prevAddress,
        };
        puskesmasUpdateCurrentSchema.parse(updatedDatas);

        const response = await updateCurrentPuskesmas(updatedDatas);
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Berhasil",
            detail: "Data Puskesmas diperbarui",
            life: 3000,
          });

          setIsUpdated(true);
          setVisibleUpdateProfile(false);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        if (isApotekUpdate) {
          HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        } else {
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        }
        handleApiError(error, toast);
      }
    }
  };

  const handleModalChangePassword = () => {
    setVisibleChangePassword(true);
    setVisible(false);
  };

  const handleChangePassword = async () => {
    try {
      superAdminChangePasswordSchema.parse(dataPassword);

      let response;
      if (role === "admin") {
        response = await updatePassword(dataPassword);
      } else if (role === "nakes") {
        response = await updatePasswordPuskesmas(dataPassword);
      } else if (role === "apoteker") {
        response = await updatePasswordApotek(dataPassword);
      }

      if (response && response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Password diperbarui",
          life: 3000,
        });
        setVisibleChangePassword(false);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        handleChangePasswordError(error, toast);
        console.log(error);
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Toast ref={toast} />

      {isSidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 md:bg-transparent md:bg-opacity-0"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Sidebar */}
      <Sidebar />
      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="h-20 w-full flex items-center px-8 justify-between fixed  z-40 shadow-md dark:shadow-blackHover dark:bg-blackHover dark:text-white bg-white text-black">
          <div className="flex justify-center items-center gap-4 md:pl-80 pl-0">
            <button onClick={toggleSidebar} className="md:hidden block">
              <AlignLeft />
            </button>
            {role === "admin" && (
              <h1 className="text-xl">
                {location.pathname === "/admin/beranda" ? "Beranda" : ""}
                {location.pathname === "/admin/data-puskesmas"
                  ? "Data Puskesmas"
                  : ""}
                {location.pathname === "/admin/data-apotek"
                  ? "Data Apotek"
                  : ""}
                {location.pathname === "/admin/data-pasien"
                  ? "Data Pasien"
                  : ""}
                {location.pathname === "/admin/data-pengguna"
                  ? "Data Pengguna"
                  : ""}
                {location.pathname === "/admin/data-obat" ? "Data Obat" : ""}
                {location.pathname === "/admin/data-kontrol-balik"
                  ? "Data Kontrol Balik"
                  : ""}
                {location.pathname === "/admin/data-pengambilan-obat"
                  ? "Data Pengambilan Obat"
                  : ""}
              </h1>
            )}

            {role === "nakes" && (
              <h1 className="text-xl">
                {location.pathname === "/puskesmas/beranda" ? "Beranda" : ""}
                {location.pathname === "/puskesmas/profile" ? "Profile" : ""}
                {location.pathname === "/puskesmas/data-apotek"
                  ? "Data Apotek"
                  : ""}
                {location.pathname === "/puskesmas/data-pasien"
                  ? "Data Pasien"
                  : ""}
                {location.pathname === "/puskesmas/data-kontrol-balik"
                  ? "Data Kontrol Balik"
                  : ""}
                {location.pathname === "/puskesmas/data-pengambilan-obat"
                  ? "Data Pengambilan Obat"
                  : ""}
              </h1>
            )}
            {role === "apoteker" && (
              <h1 className="text-xl">
                {location.pathname === "/apotek/beranda" ? "Beranda" : ""}
                {location.pathname === "/apotek/profile" ? "Profile" : ""}
                {location.pathname === "/apotek/data-obat" ? "Data Obat" : ""}
                {location.pathname === "/apotek/data-pengambilan-obat"
                  ? "Data Pengambilan Obat"
                  : ""}
              </h1>
            )}
          </div>
          <div className="flex justify-between items-center ">
            <div>
              <ThemeSwitcher />
            </div>
            <Button
              className="p-1 rounded-full cursor-pointer bg-lightGreen dark:bg-mainGreen"
              label={<Settings2 className="text-white" />}
              onClick={() => setVisible(true)}
            ></Button>
          </div>
        </div>

        <div className="flex-grow bg-gray-200 dark:bg-black dark:text-white h-auto md:pl-80    pt-20 overflow-y-scroll w-full overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Modal Menu */}
      <Dialog
        header="Menu"
        visible={visible}
        className="fixed top-20 md:right-8 right-1 md:w-64"
        modal={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col text-lg ">
          {role === "admin" && (
            <Link
              to=""
              onClick={handleModalChangePassword}
              className="mb-4 w-full flex gap-4"
            >
              <Lock />
              <h1>Ubah Password</h1>
            </Link>
          )}

          {role === "nakes" && (
            <div>
              <Link
                to=""
                onClick={handleDetailProfileModal}
                className="mb-4 w-full flex gap-4"
              >
                <User />
                <h1>Profile</h1>
              </Link>

              <Link
                to=""
                onClick={handleModalChangePassword}
                className="mb-4 w-full flex gap-4"
              >
                <Lock />
                <h1>Ubah Password</h1>
              </Link>
            </div>
          )}

          {role === "apoteker" && (
            <div>
              <Link
                to=""
                onClick={handleDetailProfileModal}
                className="mb-4 w-full flex gap-4"
              >
                <User />
                <h1>Profile</h1>
              </Link>

              <Link
                to=""
                onClick={handleModalChangePassword}
                className="mb-4 w-full flex gap-4"
              >
                <Lock />
                <h1>Ubah Password</h1>
              </Link>
            </div>
          )}
          <Link
            to=""
            className="mb-4 w-full flex gap-4"
            onClick={() => setVisibleLogout(true)}
          >
            <LogOut />
            <h1>Logout</h1>
          </Link>
        </div>
      </Dialog>

      {/* Modal Detail Profile */}
      <Dialog
        header={
          isApotekUpdate ? "Detail Profile Apotek" : "Detail Profile Puskesmas"
        }
        visible={visibleDetailProfile}
        maximizable
        className="md:w-1/2 w-full"
        onHide={() => {
          if (!visibleDetailProfile) return;
          setVisibleDetailProfile(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            {isApotekUpdate ? "Nama Apotek" : "Nama Puskesmas"}:
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={
              isApotekUpdate
                ? dataApotek.namaApotek
                : dataPuskesmas.namaPuskesmas
            }
          />
          {errors.namaApotek && (
            <small className="p-error -mt-3 text-sm">{errors.namaApotek}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={isApotekUpdate ? dataApotek.telepon : dataPuskesmas.telepon}
          />
          {errors.telepon && (
            <small className="p-error -mt-3 text-sm">{errors.telepon}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <InputTextarea
            variant="filled"
            disabled
            autoResize
            className="p-input text-lg p-3 rounded"
            value={isApotekUpdate ? dataApotek.alamat : dataPuskesmas.alamat}
          />
          <Button
            label="Edit Profile"
            className="p-4 bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen rounded-xl  transition-all"
            onClick={handleUpdateProfileModal}
          />
        </div>
      </Dialog>

      {/* Modal Update Profile */}
      <Dialog
        header={
          isApotekUpdate ? "Edit Profile Apotek" : "Edit Profile Puskesmas"
        }
        visible={visibleUpdateProfile}
        maximizable
        className="md:w-1/2 w-full"
        onHide={() => {
          if (!visibleUpdateProfile) return;
          setVisibleUpdateProfile(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            {isApotekUpdate ? "Nama Apotek" : "Nama Puskesmas"}:
          </label>
          <InputText
            type="text"
            placeholder={isApotekUpdate ? "Nama Apotek" : "Nama Puskesmas"}
            className="p-input text-lg p-3 rounded"
            value={
              isApotekUpdate
                ? dataApotek.namaApotek
                : dataPuskesmas.namaPuskesmas
            }
            onChange={(e) =>
              isApotekUpdate
                ? setDataApotek((prev) => ({
                    ...prev,
                    namaApotek: e.target.value,
                  }))
                : setDataPuskesmas((prev) => ({
                    ...prev,
                    namaPuskesmas: e.target.value,
                  }))
            }
          />
          {errors.namaApotek && (
            <small className="p-error -mt-3 text-sm">{errors.namaApotek}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
          <InputText
            type="text"
            placeholder="Telepon"
            className="p-input text-lg p-3 rounded"
            value={isApotekUpdate ? dataApotek.telepon : dataPuskesmas.telepon}
            onChange={(e) =>
              isApotekUpdate
                ? setDataApotek((prev) => ({
                    ...prev,
                    telepon: e.target.value,
                  }))
                : setDataPuskesmas((prev) => ({
                    ...prev,
                    telepon: e.target.value,
                  }))
            }
          />
          {errors.telepon && (
            <small className="p-error -mt-3 text-sm">{errors.telepon}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <DynamicAddress prevAddress={prevAddress} />
          <span className="text-sm -mt-4">
            *Kosongkan alamat jika tidak ingin diubah
          </span>
          {errors.alamat && (
            <small className="p-error -mt-3 text-sm">{errors.alamat}</small>
          )}
          <Button
            label="Edit"
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={handleUpdateProfile}
          />
        </div>
      </Dialog>

      {/* Modal ubah password */}
      <Dialog
        header={"Ubah Password"}
        visible={visibleChangePassword}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleChangePassword) return;
          setVisibleChangePassword(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Password lama:
          </label>

          <InputText
            type="password"
            placeholder="Password Lama"
            className="p-input text-lg p-3  rounded"
            value={dataPassword.currentPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          {errors.currentPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.currentPassword}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Password baru:
          </label>
          <InputText
            type="password"
            placeholder="Password Baru"
            className="p-input text-lg p-3  rounded"
            value={dataPassword.newPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          {errors.newPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.newPassword}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Konfirmasi password:
          </label>
          <InputText
            type="password"
            placeholder="Konfirmasi Password Baru"
            className="p-input text-lg p-3  rounded"
            value={dataPassword.confirmPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          {errors.confirmPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.confirmPassword}
            </small>
          )}
          <Button
            label={"Edit"}
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={handleChangePassword}
          />
        </div>
      </Dialog>

      {/* Modal Logout */}
      <Dialog
        header="Logout"
        visible={visibleLogout}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleLogout) return;
          setVisibleLogout(false);
          setVisible(false);
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">Apakah anda yakin ingin logout?</div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleLogout(false) || setVisible(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              label="Logout"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleLogout}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default NavbarAdmin;
