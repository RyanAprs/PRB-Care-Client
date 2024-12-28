import img from "../../../assets/home.png";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { Ripple } from "primereact/ripple";
import { useInstallPrompt } from "../../../config/context/InstallPromptContext.jsx";
import useDarkMode from "use-dark-mode";
import { motion } from "framer-motion";
import { Toast } from "primereact/toast";
import { useNotificationSetup } from "../../../config/context/NotificationSetupContext.jsx";
import Marquee from "../../../components/marquee/Marquee.jsx";
import { ProgressSpinner } from "primereact/progressspinner";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection.jsx";
import { AuthContext } from "../../../config/context/AuthContext.jsx";
import { getAllJadwalProlanisAktif } from "../../../services/JadwalProlanisService.js";
import { HandleUnauthorizedPengguna } from "../../../utils/HandleUnauthorized.jsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomePengguna = () => {
  const toast = useRef(null);
  const { permission, handleNotificationSetup } = useNotificationSetup();
  const { installPromptEvent, promptInstall } = useInstallPrompt();
  const darkMode = useDarkMode(false, { classNameDark: "dark" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJadwalProlanisAktif();
      setData(response);
      setLoading(false);
      setisConnectionError(false);
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "EAI_AGAIN" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "ECONNRESET" ||
        error.code === "EPIPE"
      ) {
        setisConnectionError(true);
      }
      setLoading(false);
      HandleUnauthorizedPengguna(error.response, dispatch, navigate);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isLogin") === "true") {
      handleNotificationSetup();
      localStorage.removeItem("isLogin");
    }
    fetchData();
  }, [token, navigate, dispatch]);

  if (loading) {
    return (
      <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays max-h-fit min-h-screen  flex justify-center items-center">
        <div className="p-8 w-full max-h-fit min-h-screen flex items-center justify-center  bg-white dark:bg-blackHover rounded-xl">
          <ProgressSpinner />
        </div>
      </div>
    );
  }

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const handleToast = () => {
    toast.current.show({
      severity: "error",
      summary: "Gagal",
      detail:
        "Izin notifikasi diblokir. Lakukan unblock izin notifikasi di pengaturan.",
      life: 3000,
    });
  };

  return (
    <div className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />
      <div className="flex w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center">
        <div className="md:p-8 p-6 flex md:justify-center justify-start items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col justify-start items-center gap-4 md:w-1/2 md:mr-10"
          >
            <div className="md:block  w-full overflow-hidden">
              <Marquee data={data} />
            </div>
            <img src={img} className="md:hidden w-4/5" alt="img" />

            <h1 className="md:text-6xl text-4xl font-semibold dark:text-whiteHover">
              {permission !== "granted" || installPromptEvent !== null
                ? "Selamat Datang Ikuti Instruksi di Bawah Ini untuk Memulai"
                : "Anda Telah Bergabung dengan PRBCare"}
            </h1>
            <div className="flex flex-col items-center">
              <p
                className={`text-lg text-justify w-full ${
                  permission === "granted" ? "hidden" : ""
                }`}
              >
                Jangan lupa untuk mengaktifkan permintaan izin untuk notifikasi
                di browser anda, Jika Anda belum melihat permintaan izin untuk
                notifikasi, tekan tombol "Aktifkan Notifikasi" lalu pilih
                "Allow" atau "Izinkan".
              </p>
              <p
                className={`text-lg text-justify w-full ${
                  permission !== "granted" || installPromptEvent === null
                    ? "hidden"
                    : ""
                }`}
              >
                Untuk pengalaman terbaik dengan aplikasi PRBCare, install
                aplikasi sebagai Progressive Web App (PWA). Cukup klik tombol
                "Install PRBCare" di bawah ini, lalu pilih "Install" untuk
                menambahkan aplikasi ke perangkat Anda.
              </p>
              <p
                className={`text-lg text-justify w-full ${
                  permission !== "granted" || installPromptEvent !== null
                    ? "hidden"
                    : ""
                }`}
              >
                Terima kasih telah bergabung dengan PRBCare! Untuk memulai,
                silahkan cari puskesmas terdaftar PRBCare terdekat dengan lokasi
                Anda. Hubungi puskesmas melalui nomor yang tertera, dan pihak
                puskesmas akan memberikan nomor antrean untuk Anda. Jika Anda
                membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi
                kami.
              </p>
            </div>
            <div className="text-xl md:text-start flex cstm:flex-row flex-col justify-start items-center gap-4 w-full">
              {permission === "granted" && installPromptEvent === null ? (
                <div className="flex cstm:flex-row flex-col gap-2 cstm:w-auto w-full">
                  <Link
                    to="/data-puskesmas"
                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                  >
                    <div className="flex gap-2 justify-center items-center text-lg">
                      Cari Puskesmas
                    </div>
                    <Ripple />
                  </Link>
                  <Link
                    to="/data-apotek"
                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                  >
                    <div className="flex gap-2 justify-center items-center text-lg">
                      Cari Apotek
                    </div>
                    <Ripple />
                  </Link>
                  <Link
                    to="/prolanis"
                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                  >
                    <div className="flex gap-2 justify-center items-center text-lg ">
                      Jadwal Prolanis
                    </div>
                    <Ripple />
                  </Link>
                  <Link
                    to="/artikel"
                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                  >
                    <div className="flex gap-2 justify-center items-center text-lg ">
                      Artikel Kesehatan
                    </div>
                    <Ripple />
                  </Link>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      permission !== "denied"
                        ? (localStorage.setItem("needRegisterDevice", "true"),
                          handleNotificationSetup())
                        : handleToast()
                    }
                    className={`${
                      permission === "granted" ? "hidden" : ""
                    } bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                    label={
                      <div className="flex gap-2 justify-center items-center text-lg">
                        Aktifkan Notifikasi
                      </div>
                    }
                  />
                  <Button
                    onClick={promptInstall}
                    className={`${
                      permission !== "granted" || installPromptEvent === null
                        ? "hidden"
                        : ""
                    } bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full cstm:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                    label={
                      <div className="flex gap-2 justify-center items-center text-lg">
                        Install PRBCare
                      </div>
                    }
                  />
                </>
              )}
            </div>
          </motion.div>
          <motion.img
            src={img}
            className="md:w-1/4 min-[1980px]:w-1/4 md:block hidden"
            alt="img"
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeInUp}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePengguna;
