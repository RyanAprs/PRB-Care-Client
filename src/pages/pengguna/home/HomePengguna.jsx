import img from "../../../assets/home.png";
import gif from "../../../assets/tutor.gif";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { updateCurrentTokenPerangkatPengguna } from "../../../services/PenggunaService";
import { Link } from "react-router-dom";
import { Ripple } from "primereact/ripple";
const VITE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
const firebaseConfig = {
  apiKey: "AIzaSyCD3Ev4h06VRpvizQAsmI0G8VIiaVjNxnw",
  authDomain: "prb-care-v1-70a29.firebaseapp.com",
  projectId: "prb-care-v1-70a29",
  storageBucket: "prb-care-v1-70a29.appspot.com",
  messagingSenderId: "665778315877",
  appId: "1:665778315877:web:0271e8ba4b02529d951c8c",
  measurementId: "G-122Y1K7VRS",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const HomePengguna = () => {
  const [permission, setPermission] = useState(
      typeof Notification !== "undefined" ? Notification.permission : "granted"
  );
  const [isAndroid, setIsAndroid] = useState(false);
  const [isChromeAndroid, setIsChromeAndroid] = useState(false);
  const [isFloating, setIsFloating] = useState(localStorage.getItem("floating") === "true");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent) && !/edg/i.test(userAgent) && !/opr/i.test(userAgent) && !/samsung/i.test(userAgent) && !/ucbrowser/i.test(userAgent) && !/brave/i.test(userAgent) && !/vivaldi/i.test(userAgent) && !/firefox/i.test(userAgent) && !/duckduckgo/i.test(userAgent) && !/puffin/i.test(userAgent) && !/miuibrowser/i.test(userAgent) && !/kiwi/.test(userAgent) && !/tor/i.test(userAgent) && !/yabrowser/i.test(userAgent);
    setIsAndroid(isAndroidDevice);
    setIsChromeAndroid(isChrome && isAndroidDevice);
  }, []);


  useEffect(() => {
    localStorage.setItem("floating", isFloating);
  }, [isFloating]);

  const handleNotificationSetup = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      setPermission("granted");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js", {
                scope: "/"
              }
          );

          const currentToken = await getToken(messaging, {
            vapidKey: `${VITE_VAPID_KEY}`,
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            await handleUpdate(currentToken);
          } else {
            console.log("No registration token available.");
          }
        }
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("An error occurred during notification setup:", error);
    }
  };


  const handleUpdate = async (currentToken) => {
    try {
      const data = { TokenPerangkat: currentToken };
      const response = await updateCurrentTokenPerangkatPengguna(data);
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelanjutnya = () => {
    setIsFloating(true);
  }

  useEffect(() => {
    if (localStorage.getItem("isLogin") === "true") {
      handleNotificationSetup();
      localStorage.removeItem("isLogin");
    }
  }, []);

  return (
      <div className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
        <div className="flex w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center">
          <div className="p-8 flex  md:justify-center justify-start items-center gap-7">
            <div className="flex flex-col justify-start items-center gap-7 md:w-1/2">
              <img src={img} className="md:hidden w-4/5" alt="img"/>
              <h1 className="md:text-6xl text-3xl font-semibold text-justify md:text-start dark:text-whiteHover">
                {permission !== "granted" || (isFloating === false && isAndroid === true)
                    ? "Selamat Datang, Ikuti Instruksi di Bawah ini Untuk Memulai"
                    : "Anda Telah Bergabung dengan PRBCare"}
                .
              </h1>

              <div className={`flex flex items-center `}>
                <div className={`${permission !== "granted" ||
                isFloating === true || isAndroid !== true || (isAndroid === true && isChromeAndroid !== true) ? "hidden" : ""}`}>
                  <img
                      src={gif}
                      className="rounded-xl mb-5 border"
                      alt="img"
                  />
                  <p
                      className={`text-lg text-justify w-full md:pr-10 `}
                  >
                    Untuk memastikan Anda mendapatkan pengalaman terbaik dengan notifikasi dari aplikasi kami, aktifkan
                    izin notifikasi mengambang seperti pada contoh di atas. Jika sudah selesai, klik tombol "Selanjutnya"
                    di
                    bawah ini.
                  </p>

                </div>

                <p className={`text-lg text-justify w-full md:pr-10 ${permission === "granted" && (isAndroid === true && isChromeAndroid === false) && isFloating !== true ? "" : "hidden"}`}>
                  Anda tampaknya menggunakan browser selain Chrome di Android. Untuk pengalaman terbaik, kami sarankan
                  Anda
                  menginstall Chrome dari Play Store dengan melakukan klik pada tombol "Install Chrome". Namun
                jika Anda tetap ingin melanjutkan, klik tombol "Selanjutnya" di bawah ini. Harap
                  diperhatikan bahwa
                  notifikasi mungkin tidak berjalan dengan baik atau bahkan tidak tersedia.
                </p>

                <p
                    className={`text-lg text-justify w-full md:pr-10 ${
                        permission === "granted" ? "hidden" : ""
                    }`}
                >
                  Jangan lupa untuk mengaktifkan permintaan izin untuk notifikasi
                  di browser anda, Jika Anda belum melihat permintaan izin untuk
                  notifikasi, tekan tombol "Aktifkan Notifikasi" lalu pilih
                  "Allow" atau "Izinkan". Setelah itu anda bisa mendapatkan notifikasi dari kami
                  mengenai kontrol balik dan pengambilan obat.
                </p>
                <p
                    className={`text-lg text-justify w-full md:pr-10 ${
                        permission !== "granted" || (isFloating === false && isAndroid === true)
                            ? "hidden"
                            : ""
                    }`}
                >
                  Terima kasih telah bergabung dengan PRBCare! Untuk memulai,
                  silakan cari puskesmas terdekat dari lokasi Anda. Hubungi
                  puskesmas melalui nomor yang tertera, dan pihak puskesmas akan
                  memberikan nomor antrean untuk Anda. Jika Anda membutuhkan
                  bantuan lebih lanjut, jangan ragu untuk menghubungi kami.
                </p>

              </div>
              <div className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
                {permission === "granted" && (isFloating === true || isAndroid === false) ? (
                    <>
                      <Link
                          to="/data-puskesmas"
                          target="_blank"
                          className="p-ripple bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                      >
                        <div className="flex gap-2 justify-center items-center text-lg">
                          Cari Puskesmas
                        </div>
                        <Ripple/>
                      </Link>
                      <Link
                          to="/data-apotek"
                          target="_blank"
                          className="p-ripple bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                      >
                        <div className="flex gap-2 justify-center items-center text-lg">
                          Cari Apotek
                        </div>
                        <Ripple/>
                      </Link>
                    </>
                ) : (
                    <>
                      <Button
                          onClick={handleNotificationSetup}
                          className={`${permission === "granted" && "hidden"} bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                          label={
                            <div className="flex gap-2 justify-center items-center text-lg ">
                              {permission === "granted"
                                  ? "Notifikasi Aktif"
                                  : "Aktifkan Notifikasi"}
                            </div>
                          }
                      />
                      <Link
                          to="https://play.google.com/store/apps/details?id=com.android.chrome"
                          target="_blank"
                          className={`${permission === "granted" && (isAndroid === true && isChromeAndroid === false) && isFloating !== true ? "" : "hidden"} p-ripple bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                      >
                        <div className="flex gap-2 justify-center items-center text-lg">
                          Install Chrome
                        </div>
                        <Ripple/>
                      </Link>
                      <Button
                          onClick={handleSelanjutnya}
                          className={`${permission === "granted" && (isFloating === false && isAndroid === true) ? "" : "hidden"} bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                          label={
                            <div className="flex gap-2 justify-center items-center text-lg">
                              Selanjutnya
                            </div>
                          }
                      />
                    </>
                )}
              </div>
            </div>
            <img
                src={img}
                className="md:w-1/3 min-[1980px]:w-1/4 md:block hidden"
                alt="img"
            />
          </div>
        </div>
      </div>
  );
};

export default HomePengguna;
