import { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlignJustify,
  LayoutGrid,
  Hospital,
  HousePlus,
  DoorOpen,
  ArrowRight,
  ArrowLeft,
  Pill,
  ShoppingCart,
  Stethoscope,
  CircleUser,
  User,
  Settings2,
  GitPullRequestClosed,
  LockKeyhole,
  UserPlus,
} from "lucide-react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Menu as Menuk } from "primereact/menu";
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
import WaktuOperasional from "../waktuOperasional/WaktuOperasional";

const NavbarAdmin = ({ children }) => {
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
  const { role } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const [isApotekUpdate, setIsApotekUpdate] = useState(false);
  const [dataApotek, setDataApotek] = useState({
    namaApotek: "",
    telepon: "",
    alamat: "",
    waktuOperasional: "",
  });
  const [dataPuskesmas, setDataPuskesmas] = useState({
    namaPuskesmas: "",
    telepon: "",
    alamat: "",
    waktuOperasional: "",
  });

  const [detailDataPuskesmas, setDetailDataPuskesmas] = useState({
    namaPuskesmas: "",
    telepon: "",
    alamat: "",
    waktuOperasional: "",
  });
  const [detailDataApotek, setDetailDataApotek] = useState({
    namaPuskesmas: "",
    telepon: "",
    alamat: "",
    waktuOperasional: "",
  });

  const [prevAddress, setPrevAddress] = useState({});
  const [waktuOperasionalList, setWaktuOperasionalList] = useState([]);
  const [prevWaktuOperasional, setPrevWaktuOperasional] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [toggle, setToggle] = useState(false);
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

  const handleSidebarToggle = () => {
    setToggle(!toggle);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    const themeLink = document.getElementById("theme-link");
    if (themeLink) {
      const themeUrl = new URL(
        "primereact/resources/themes/saga-green/theme.css",
        import.meta.url
      ).href;
      themeLink.href = themeUrl;
      document.body.classList.remove("dark");
    }

    if (role === "admin") {
      navigate("/admin/login");
    } else if (role === "nakes") {
      navigate("/puskesmas/login");
    } else if (role === "apoteker") {
      navigate("/apotek/login");
    }
  };

  //menu
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [key, setKey] = useState(0);
  const itemsNotAdmin = [
    {
      label: (
        <div className="flex justify-center items-center mx-auto gap-2 ">
          <CircleUser />
          <h1>Detail Profile</h1>
        </div>
      ),
      command: () => handleDetailProfileModal(),
    },
    {
      label: (
        <div className="flex justify-center items-center gap-2">
          <LockKeyhole />
          <h1>Ganti Password</h1>
        </div>
      ),
      command: () => handleModalChangePassword(),
    },
    {
      label: (
        <div className="flex justify-center items-center gap-2">
          <DoorOpen />
          <h1>Keluar</h1>
        </div>
      ),
      command: () => handleModalLogout(),
    },
  ];
  const itemsAdmin = [
    {
      label: (
        <div className="flex justify-center items-center gap-2">
          <LockKeyhole />
          <h1>Ganti Password</h1>
        </div>
      ),
      command: () => handleModalChangePassword(),
    },
    {
      label: (
        <div className="flex justify-center items-center gap-2">
          <DoorOpen />
          <h1>Keluar</h1>
        </div>
      ),
      command: () => handleModalLogout(),
    },
  ];

  const handleModalLogout = () => {
    setIsMenuVisible(false);
    setVisibleLogout(true);
  };
  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
    setKey((prev) => prev + 1);
  };

  const formatWaktuOperasional = () => {
    return waktuOperasionalList.join(" <br /> ");
  };

  const validasiWaktuOperasional = (value) => {
    const valueString = value ? value.toString() : "";

    if (valueString.includes("<br />")) {
      return (
        <ul className="list-disc pl-5 bg-[#fbfbfc] dark:bg-[#282828]">
          {valueString.split("<br />").map((item, index) => (
            <li className="text-[#989da0] dark:text-[#6e6e6e]" key={index}>
              {item.trim()}
            </li>
          ))}
        </ul>
      );
    }

    return <span className="text-[#989da0] dark:text-[#6e6e6e]" >{valueString}</span>;
  };

  const handleDetailProfileModal = async () => {
    setErrors({});
    setIsMenuVisible(false);
    setVisibleDetailProfile(true);
    if (role === "nakes") {
      setIsApotekUpdate(false);
      setDetailDataPuskesmas({});
      try {
        const dataResponse = await getCurrentAdminPuskesmas();
        if (dataResponse) {
          setDetailDataPuskesmas({
            namaPuskesmas: dataResponse.namaPuskesmas,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
            waktuOperasional: dataResponse.waktuOperasional,
          });
          setVisibleDetailProfile(true);
        }
      } catch (error) {
        setVisibleDetailProfile(false);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
    if (role === "apoteker") {
      setIsApotekUpdate(true);
      setDetailDataApotek({});
      try {
        const dataResponse = await getCurrentAdminApotek();
        if (dataResponse) {
          setDetailDataApotek({
            namaApotek: dataResponse.namaApotek,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
            waktuOperasional: dataResponse.waktuOperasional,
          });
        }
      } catch (error) {
        HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const { setIsUpdated } = useModalUpdate();

  const handleUpdateProfileModal = async () => {
    setVisibleDetailProfile(false);
    setErrors({});
    setVisibleUpdateProfile(true);
    if (role === "nakes") {
      setIsApotekUpdate(false);
      try {
        const dataResponse = await getCurrentAdminPuskesmas();
        setPrevAddress(dataResponse.alamat);
        setPrevWaktuOperasional(dataResponse.waktuOperasional);

        if (dataResponse) {
          setDataPuskesmas({
            namaPuskesmas: dataResponse.namaPuskesmas,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
            waktuOperasional: dataResponse.waktuOperasional,
          });
        }
      } catch (error) {
        setVisibleUpdateProfile(false);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }

    if (role === "apoteker") {
      setIsApotekUpdate(true);
      try {
        const dataResponse = await getCurrentAdminApotek();
        setPrevWaktuOperasional(dataResponse.waktuOperasional);
        setPrevAddress(dataResponse.alamat);

        if (dataResponse) {
          setDataApotek({
            namaApotek: dataResponse.namaApotek,
            alamat: dataResponse.alamat,
            telepon: dataResponse.telepon,
            waktuOperasional: dataResponse.waktuOperasional,
          });
          setVisibleDetailProfile(false);
        }
      } catch (error) {
        HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleUpdateProfile = async () => {
    const formattedWaktuOperasional = formatWaktuOperasional();

    try {
      if (isApotekUpdate) {
        const updatedDatas = {
          ...dataApotek,
          alamat: dataApotek.alamat || prevAddress,
          waktuOperasional: formattedWaktuOperasional || prevWaktuOperasional,
        };
        apotekUpdateCurrentSchema.parse(updatedDatas);

        const response = await updateCurrentApotek(updatedDatas);
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Berhasil",
            detail: "Apotek diperbarui",
            life: 3000,
          });

          setIsUpdated(true);
          setVisibleUpdateProfile(false);
          handleDetailProfileModal();
        }
      } else {
        const updatedDatas = {
          ...dataPuskesmas,
          alamat: dataPuskesmas.alamat || prevAddress,
          waktuOperasional: formattedWaktuOperasional || prevWaktuOperasional,
        };
        puskesmasUpdateCurrentSchema.parse(updatedDatas);

        const response = await updateCurrentPuskesmas(updatedDatas);
        if (response.status === 200) {
          handleDetailProfileModal();
          toast.current.show({
            severity: "success",
            summary: "Berhasil",
            detail: "Puskesmas diperbarui",
            life: 3000,
          });

          setIsUpdated(true);
          setVisibleUpdateProfile(false);
          handleDetailProfileModal();
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
    setDataPassword({});
    setErrors({});
    setIsMenuVisible(false);
    setVisibleChangePassword(true);
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
        setVisibleChangePassword(false);
        handleChangePasswordError(error, toast);
        console.log(error);
      }
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />

      <Sidebar
        className="md:w-1/4 md:block  text-white border-r-white "
        backgroundColor={
          localStorage.getItem("darkMode") === "false" ? "#40916C" : "#276f4c"
        }
        collapsed={toggle ? false : expanded}
        breakPoint={"md"}
        toggled={toggle}
        onBackdropClick={handleSidebarToggle}
      >
        <Menu
          menuItemStyles={{
            button: {
              ["&:hover"]:
                localStorage.getItem("darkMode") === "true"
                  ? {
                      backgroundColor: "#40916C",
                      color: "white",
                    }
                  : { backgroundColor: "#56A17E", color: "white" },
            },
            span: {
              marginRight: "0px",
            },
          }}
          className={` ${expanded ? "" : "px-3"}`}
        >
          <Menu>

            <div
              className={`flex flex-col  font-semibold text-lg mb-2 items-center mt-0.5 justify-center`}
            >
              <>
                <div>
                  <img
                  src={icon}
                  alt="LOGO PRB CARE"
                  className={`${expanded ? "hidden" : "block"} w-auto px-2 max-h-20 mt-3 `}
                />
                <h1 className={`text-center ${expanded ? "mb-2" : "mb-3" }`}>{expanded ? " " : "PRBCare"}</h1>
                </div>
              </>

              <img
                src={icon}
                alt="LOGO PRB CARE"
                className={`${expanded ? "block" : "hidden"} w-auto px-2 max-h-20`}
              />

              <hr className={`w-full border-b border-lightGreen ${expanded ? "mt-3 w-[60px] " : "mb-1"}`} />
            </div>

          </Menu>
          {role === "admin" ? (
            <>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<LayoutGrid />}
                component={
                  <Link
                    to="/admin/beranda"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/beranda"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Beranda
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<Hospital />}
                component={
                  <Link
                    to="/admin/data-puskesmas"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-puskesmas"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Puskesmas
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<HousePlus />}
                component={
                  <Link
                    to="/admin/data-apotek"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-apotek"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Apotek
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<User />}
                component={
                  <Link
                    to="/admin/data-pengguna"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-pengguna"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Pengguna
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<UserPlus />}
                component={
                  <Link
                    to="/admin/data-pasien"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-pasien"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Pasien
              </MenuItem>
              
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<Stethoscope />}
                component={
                  <Link
                    to="/admin/data-kontrol-balik"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-kontrol-balik"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Kontrol Balik
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<Pill />}
                component={
                  <Link
                    to="/admin/data-obat"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-obat"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Obat
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<ShoppingCart />}
                component={
                  <Link
                    to="/admin/data-pengambilan-obat"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/admin/data-pengambilan-obat"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Ambil Obat
              </MenuItem>
            </>
          ) : role === "nakes" ? (
            <>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<LayoutGrid />}
                component={
                  <Link
                    to="/puskesmas/beranda"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/puskesmas/beranda"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Beranda
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<UserPlus />}
                component={
                  <Link
                    to="/puskesmas/data-pasien"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/puskesmas/data-pasien"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Pasien
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<Stethoscope />}
                component={
                  <Link
                    to="/puskesmas/data-kontrol-balik"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/puskesmas/data-kontrol-balik"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Kontrol Balik
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<ShoppingCart />}
                component={
                  <Link
                    to="/puskesmas/data-pengambilan-obat"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/puskesmas/data-pengambilan-obat"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Ambil Obat
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<LayoutGrid />}
                component={
                  <Link
                    to="/apotek/beranda"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/apotek/beranda"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Beranda
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<Pill />}
                component={
                  <Link
                    to="/apotek/data-obat"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/apotek/data-obat"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Obat
              </MenuItem>
              <MenuItem
                className={`${expanded ? "mb-2" : "mb-3" }`}
                icon={<ShoppingCart />}
                component={
                  <Link
                    to="/apotek/data-pengambilan-obat"
                    className={`flex  hover:bg-lightGreen dark:hover:bg-mainGreen ${
                      location.pathname === "/apotek/data-pengambilan-obat"
                        ? "bg-lightGreen dark:bg-mainGreen"
                        : ""
                    } rounded ${expanded ? "mx-2" : ""} transition-all`}
                  ></Link>
                }
              >
                Ambil Obat
              </MenuItem>
            </>
          )}
        </Menu>
      </Sidebar>

      <div className="flex flex-col w-full overflow-hidden ">
        {/* Navbar */}
        <div className="flex items-center px-6  w-full z-40 shadow-md  dark:shadow-none dark:shadow-blackHover dark:bg-blackHover dark:text-white bg-white text-black">
          <div className="flex py-6 w-full items-center gap-4">
            <Button
              severity="secondary"
              onClick={() => {
                setToggle(!toggle);
              }}
              text
              className="p-1 rounded-full cursor-pointer md:hidden"
              label={<AlignJustify className="dark:text-white text-black" />}
            ></Button>

            <Button
              severity="secondary"
              onClick={() => {
                setExpanded(!expanded);
              }}
              text
              className="p-1 rounded-full cursor-pointer hidden md:block"
              label={
                expanded ? (
                  <ArrowRight className="dark:text-white text-black" />
                ) : (
                  <ArrowLeft className="dark:text-white text-black" />
                )
              }
            ></Button>

            {role === "admin" && (
              <h1 className="text-xl">
                {location.pathname === "/admin/beranda" ? "Beranda" : ""}
                {location.pathname === "/admin/data-puskesmas"
                  ? "Puskesmas"
                  : ""}
                {location.pathname === "/admin/data-apotek" ? "Apotek" : ""}
                {location.pathname === "/admin/data-pasien" ? "Pasien" : ""}
                {location.pathname === "/admin/data-pengguna" ? "Pengguna" : ""}
                {location.pathname === "/admin/data-obat" ? "Obat" : ""}
                {location.pathname === "/admin/data-kontrol-balik"
                  ? "Kontrol Balik"
                  : ""}
                {location.pathname === "/admin/data-pengambilan-obat"
                  ? "Ambil Obat"
                  : ""}
              </h1>
            )}

            {role === "nakes" && (
              <h1 className="text-xl">
                {location.pathname === "/puskesmas/beranda" ? "Beranda" : ""}
                {location.pathname === "/puskesmas/profile" ? "Profile" : ""}
                {location.pathname === "/puskesmas/data-apotek" ? "Apotek" : ""}
                {location.pathname === "/puskesmas/data-pasien" ? "Pasien" : ""}
                {location.pathname === "/puskesmas/data-kontrol-balik"
                  ? "Kontrol Balik"
                  : ""}
                {location.pathname === "/puskesmas/data-pengambilan-obat"
                  ? "Ambil Obat"
                  : ""}
              </h1>
            )}
            {role === "apoteker" && (
              <h1 className="text-xl">
                {location.pathname === "/apotek/beranda" ? "Beranda" : ""}
                {location.pathname === "/apotek/profile" ? "Profile" : ""}
                {location.pathname === "/apotek/data-obat" ? "Obat" : ""}
                {location.pathname === "/apotek/data-pengambilan-obat"
                  ? "Ambil Obat"
                  : ""}
              </h1>
            )}
          </div>
          <div className="flex justify-between items-center ">
            <div>
              <ThemeSwitcher />
            </div>
            <Button
              severity="secondary"
              onClick={toggleMenuVisibility}
              text
              className="p-1 rounded-full cursor-pointer "
              label={
                !isMenuVisible ? (
                  <Settings2 className="dark:text-white text-black" />
                ) : (
                  <GitPullRequestClosed className="dark:text-white text-black" />
                )
              }
            ></Button>
          </div>
          <Menuk
           
            key={key}
            className={` ${
              isMenuVisible ? "visible" : "hidden"
            } dark:bg-blackHover shadow-md absolute top-[80px] right-0 `}
            model={role === "admin" ? itemsAdmin : itemsNotAdmin}
          >
          </Menuk>
        </div>

        <div className="flex-grow bg-gray-200 dark:bg-black dark:text-white h-auto    overflow-y-scroll w-full overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Modal Detail Profile */}
      <Dialog
        header={isApotekUpdate ? "Profile Apotek" : "Profile Puskesmas"}
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
                ? detailDataApotek.namaApotek
                : detailDataPuskesmas.namaPuskesmas
            }
          />

          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={
              isApotekUpdate
                ? detailDataApotek.telepon
                : detailDataPuskesmas.telepon
            }
          />

          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <div className="text-lg p-3 rounded bg-[#fbfbfc] dark:bg-[#282828] text-[#989da0] dark:text-[#6e6e6e] border dark:border-none min-h-14">
              <p className="text-[#989da0] dark:text-[#6e6e6e]" >{isApotekUpdate
              ? detailDataApotek.alamat
              : detailDataPuskesmas.alamat}</p>
          </div>

          <label htmlFor="" className="-mb-3">
            Waktu Operasional:
          </label>
          <div className="text-lg p-3 rounded bg-[#fbfbfc] dark:bg-[#282828] text-[#989da0] dark:text-[#6e6e6e] border dark:border-none min-h-14">
            {isApotekUpdate
              ? validasiWaktuOperasional(detailDataApotek.waktuOperasional)
              : validasiWaktuOperasional(detailDataPuskesmas.waktuOperasional)}
          </div>

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
          handleDetailProfileModal();
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
          <div className="w-full">
            <WaktuOperasional
              setWaktuOperasionalList={setWaktuOperasionalList}
            />
          </div>
          <span className="text-sm -mt-4">
            *Kosongkan waktu operasional jika tidak ingin diubah
          </span>

          {errors.waktuOperasional && (
            <small className="p-error -mt-3 text-sm">
              {errors.waktuOperasional}
            </small>
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
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">Apakah anda yakin ingin logout?</div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleLogout(false)}
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