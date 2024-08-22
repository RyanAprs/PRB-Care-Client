import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import { Menu } from "primereact/menu";
import {
  Bell,
  HomeIcon,
  ShoppingCart,
  Stethoscope,
  Settings2,
  UserPlus,
  CircleUser,
  LockKeyhole,
  DoorOpen,
  GitPullRequestClosed,
} from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AuthContext } from "../../config/context/AuthContext";
import { AddressContext } from "../../config/context/AdressContext";
import {
  getCurrentPengguna,
  updateCurrentPengguna,
  updatePasswordPengguna,
} from "../../services/PenggunaService";
import { HandleUnauthorizedPengguna } from "../../utils/HandleUnauthorized";
import {
  handleApiError,
  handleChangePasswordError,
} from "../../utils/ApiErrorHandlers";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ZodError } from "zod";
import {
  penggunaChangePasswordSchema,
  penggunaUpdateCurrentSchema,
} from "../../validations/PenggunaSchema";
import DynamicAddress from "../dynamicAddress/DynamicAddress";

const NavbarPengguna = () => {
  const { dispatch } = useContext(AuthContext);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [dataPassword, setDataPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [dataPengguna, setDataPengguna] = useState({
    namaLengkap: "",
    telepon: "",
    teleponKeluarga: "",
    alamat: "",
  });
  const [detailDataPengguna, setDetailDataPengguna] = useState({
    namaLengkap: "",
    telepon: "",
    teleponKeluarga: "",
    alamat: "",
  });
  const [errors, setErrors] = useState({});
  const [visibleDetailProfile, setVisibleDetailProfile] = useState(false);
  const [visibleUpdateProfile, setVisibleUpdateProfile] = useState(false);
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const [prevAddress, setPrevAddress] = useState({});
  const toast = useRef(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [key, setKey] = useState(0);
  const { address } = useContext(AddressContext);
  const [hasNotifications, setHasNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const openIndexedDB = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("fcm_notifications", 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("notifications")) {
            db.createObjectStore("notifications", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    const markAllAsRead = async () => {
      try {
        const db = await openIndexedDB();
        const transaction = db.transaction("notifications", "readwrite");
        const objectStore = transaction.objectStore("notifications");

        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          const notifications = event.target.result;

          const updatedNotifications = notifications.map((notification) => {
            if (!notification.isRead) {
              notification.isRead = true;
            }
            return notification;
          });

          updatedNotifications.forEach((notification) => {
            objectStore.put(notification);
          });

          setHasNotifications(updatedNotifications.some((n) => !n.isRead));
        };

        request.onerror = (event) => {
          console.error("Error updating notifications:", event.target.error);
        };
      } catch (error) {
        console.error("Failed to open IndexedDB:", error);
      }
    };

    const getNotificationsFromDB = async () => {
      try {
        const db = await openIndexedDB();
        const transaction = db.transaction("notifications", "readonly");
        const objectStore = transaction.objectStore("notifications");
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          const notifications = event.target.result;
          const hasUnread = notifications.some(
            (notification) => !notification.isRead
          );
          setHasNotifications(hasUnread);
        };

        request.onerror = (event) => {
          console.error("Error fetching notifications:", event.target.error);
        };
      } catch (error) {
        console.error("Failed to open IndexedDB:", error);
      }
    };

    if (location.pathname === "/pengguna/notifikasi") {
      markAllAsRead();
    } else {
      getNotificationsFromDB();
    }
  }, [location.pathname]);

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

    setDataPengguna((prev) => ({
      ...prev,
      alamat: formattedAddress,
    }));
  }, [address]);

  const navigate = useNavigate();

  const handleModalLogout = () => {
    setIsMenuVisible(false);
    setVisibleLogout(true);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/pengguna/beranda");
  };

  const handleModalChangePassword = () => {
    setDataPassword({});
    setErrors({});
    setIsMenuVisible(false);
    setVisibleChangePassword(true);
  };

  const handleChangePassword = async () => {
    try {
      penggunaChangePasswordSchema.parse(dataPassword);
      const response = await updatePasswordPengguna(dataPassword);
      if (response.status === 200) {
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

  const handleDetailProfileModal = async () => {
    setIsMenuVisible(false);
    setVisibleDetailProfile(true);
    try {
      const dataResponse = await getCurrentPengguna();
      if (dataResponse) {
        setDetailDataPengguna({
          namaLengkap: dataResponse.namaLengkap,
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
          teleponKeluarga: dataResponse.teleponKeluarga,
        });
      }
    } catch (error) {
      setVisibleDetailProfile(false);
      HandleUnauthorizedPengguna(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
  };

  const handleUpdateProfileModal = async () => {
    setErrors({});
    setVisibleDetailProfile(false);
    setVisibleUpdateProfile(true);
    try {
      const dataResponse = await getCurrentPengguna();
      setPrevAddress(dataResponse.alamat);
      if (dataResponse) {
        setDataPengguna({
          namaLengkap: dataResponse.namaLengkap,
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
          teleponKeluarga: dataResponse.teleponKeluarga,
        });
      }
    } catch (error) {
      setVisibleUpdateProfile(false);
      HandleUnauthorizedPengguna(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedDatas = {
        ...dataPengguna,
        alamat: dataPengguna.alamat || prevAddress,
      };
      penggunaUpdateCurrentSchema.parse(updatedDatas);

      const response = await updateCurrentPengguna(updatedDatas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Anda diperbarui",
          life: 3000,
        });
        setVisibleUpdateProfile(false);
        handleDetailProfileModal();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        HandleUnauthorizedPengguna(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };
  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
    setKey((prev) => prev + 1);
  };
  const items = [
    {
      label: (
        <div className="flex justify-center items-center gap-2">
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
  return (
    <>
      <header className="font-poppins top-0 left-0 right-0 z-50 flex justify-between bg-white dark:bg-blackHover text-white items-center py-4 md:py-6 px-5 md:px-10 transition-colors duration-300 ">
        <Toast
          ref={toast}
          position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="flex items-center justify-center font-poppins text-2xl">
          <img src={logo} width={60} height={60} alt="prb-care logo " />
          <div className="font-extrabold text-black dark:text-white">
            PRBCare
          </div>
        </div>

        <div className="flex gap-10 items-center text-xl ">
          <div className="md:flex gap-10 items-center text-xl  hidden text-black dark:text-white">
            <Link
              to={"/pengguna/beranda"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/pengguna/beranda"
                    ? "text-lightGreen dark:text-mainGreen"
                    : ""
                }
              >
                Beranda
              </h1>
            </Link>
            <Link
              to="/pengguna/medis"
              className=" transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/pengguna/medis"
                    ? "text-lightGreen dark:text-mainGreen"
                    : ""
                }
              >
                Medis
              </h1>
            </Link>
            <Link
              to="/pengguna/kontrol"
              className=" transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/pengguna/kontrol"
                    ? "text-lightGreen dark:text-mainGreen"
                    : ""
                }
              >
                Kontrol
              </h1>
            </Link>
            <Link
              to="/pengguna/obat"
              className=" transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/pengguna/obat"
                    ? "text-lightGreen dark:text-mainGreen"
                    : ""
                }
              >
                Obat
              </h1>
            </Link>

            <Link
              to="/pengguna/notifikasi"
              className="transition-all flex flex-col items-center justify-center relative"
            >
              <h1
                className={
                  location.pathname === "/pengguna/notifikasi"
                    ? "text-lightGreen dark:text-mainGreen"
                    : ""
                }
              >
                Notifikasi
              </h1>
              {hasNotifications && (
                <div className="absolute top-1 right-0 mt-[-4px] mr-[-4px]">
                  <span className="bg-mainGreen rounded-full h-2 w-2 block"></span>
                </div>
              )}
            </Link>
          </div>
          <div className="relative flex gap-2 md:gap-2 items-center justify-center">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMenuVisibility}
                text
                severity="secondary"
                className="p-1 rounded-full cursor-pointer "
                label={
                  !isMenuVisible ? (
                    <Settings2 className="text-black dark:text-white" />
                  ) : (
                    <GitPullRequestClosed className="text-black dark:text-white" />
                  )
                }
              ></Button>
            </div>
          </div>
        </div>
      </header>
      <Menu
        key={key}
        className={` ${
          isMenuVisible ? "visible" : "hidden"
        } absolute  right-0 `}
        model={items}
      />
      <div
        className="fixed z-50 md:hidden bottom-0 left-0 right-0 dark:bg-blackHover bg-white dark:text-white shadow-lg p-3 px-4"
        style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex  justify-between items-center ">
          <Link
            to={"/pengguna/beranda"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/beranda"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <HomeIcon size={25} />

            <div className="text-sm">Beranda</div>
          </Link>
          <Link
            to="/pengguna/medis"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/medis"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <UserPlus />
            <div className="text-sm">Medis</div>
          </Link>
          <Link
            to="/pengguna/kontrol"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/kontrol"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <Stethoscope />
            <div className="text-sm">Kontrol</div>
          </Link>
          <Link
            to="/pengguna/obat"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/obat"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <ShoppingCart />
            <div className="text-sm">Obat</div>
          </Link>

          <Link
            to="/pengguna/notifikasi"
            className={`flex flex-col items-center justify-center transition-all relative ${
              location.pathname === "/pengguna/notifikasi"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <Bell />
            {hasNotifications && (
              <div className="absolute top-0 right-4 mt-[-4px] mr-[-4px]">
                <span className="bg-mainGreen rounded-full h-2 w-2 block"></span>
              </div>
            )}
            <div className="text-sm">Notifikasi</div>
          </Link>
        </div>
      </div>

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
          <div className="text-xl">
            Apakah anda yakin ingin keluar dari sistem?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleLogout(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              label="Keluar"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleLogout}
              autoFocus
            />
          </div>
        </div>
      </Dialog>

      {/* Modal Detail Profile */}
      <Dialog
        header={"Profile Pengguna"}
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
            Nama Pengguna
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={detailDataPengguna.namaLengkap}
          />
          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={detailDataPengguna.telepon}
          />
          <label htmlFor="" className="-mb-3">
            Telepon Keluarga:
          </label>
          <InputText
            type="text"
            variant="filled"
            disabled
            className="p-input text-lg p-3 rounded"
            value={detailDataPengguna.teleponKeluarga}
          />
          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <div className="text-lg p-3 rounded bg-[#fbfbfc] dark:bg-[#282828] text-[#989da0] dark:text-[#6e6e6e] border dark:border-none min-h-14">
              <p className="text-[#989da0] dark:text-[#6e6e6e]" >{detailDataPengguna.alamat}</p>
          </div>
          <Button
            label="Edit Profile"
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={handleUpdateProfileModal}
          />
        </div>
      </Dialog>

      {/* Modal Update Profile */}
      <Dialog
        header="Edit Profile "
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
            Nama Lengkap:
          </label>
          <InputText
            type="text"
            placeholder="Nama Lengkap"
            className="p-input text-lg p-3 rounded"
            value={dataPengguna.namaLengkap}
            onChange={(e) =>
              setDataPengguna((prev) => ({
                ...prev,
                namaLengkap: e.target.value,
              }))
            }
          />
          {errors.namaLengkap && (
            <small className="p-error -mt-3 text-sm">
              {errors.namaLengkap}
            </small>
          )}

          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
          <InputText
            type="text"
            placeholder="Telepon"
            className="p-input text-lg p-3 rounded"
            value={dataPengguna.telepon}
            onChange={(e) =>
              setDataPengguna((prev) => ({
                ...prev,
                telepon: e.target.value,
              }))
            }
          />
          {errors.telepon && (
            <small className="p-error -mt-3 text-sm">{errors.telepon}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Telepon Keluarga:
          </label>
          <InputText
            type="text"
            placeholder="Telepon Keluarga"
            className="p-input text-lg p-3 rounded"
            value={dataPengguna.teleponKeluarga}
            onChange={(e) =>
              setDataPengguna((prev) => ({
                ...prev,
                teleponKeluarga: e.target.value,
              }))
            }
          />
          {errors.teleponKeluarga && (
            <small className="p-error -mt-3 text-sm">
              {errors.teleponKeluarga}
            </small>
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
            className="p-4 bg-lightGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainGreen dark:hover:bg-lightGreen rounded-xl  transition-all"
            onClick={handleChangePassword}
          />
        </div>
      </Dialog>
    </>
  );
};

export default NavbarPengguna;
