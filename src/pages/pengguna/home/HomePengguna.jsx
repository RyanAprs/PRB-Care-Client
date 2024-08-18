import { TabletSmartphone, Bell } from "lucide-react";
import img from "../../../assets/home.png";
import { useState } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { updateCurrentTokenPerangkatPengguna } from "../../../services/PenggunaService";

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
  const [permission, setPermission] = useState(Notification.permission);

  const handleNotificationSetup = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        console.log("Notification permission granted.");

        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );

          const currentToken = await getToken(messaging, {
            vapidKey:
              "BC0gBRfdNhV5uA9P3ohrvAlRYh5ir_sgnyUkP3QXdzT1wJtNOIk2XgYJw-6yI5nac0o_Nm082ba1BLCJ7Z1TeD0",
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            console.log("FCM Token:", currentToken);
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

  return (
    <div className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
      <div className="flex w-full bg-white dark:bg-blackHover rounded-xl md:items-center">
        <div className="p-8 flex md:justify-center justify-start items-center gap-7">
          <div className="flex flex-col justify-start items-center gap-7 md:w-1/2">
            <img src={img} className="md:hidden  w-4/5" alt="img" />
            <h1 className="md:text-6xl text-3xl font-semibold text-justify md:text-start dark:text-whiteHover">
              Selamat Datang, Ikuti Instruksi di Bawah ini Untuk Memulai.
            </h1>
            <div className="flex flex-col items-center">
              <p className={`text-lg text-justify w-full ${permission === "granted" ? "hidden" : ""}`}>
                Jangan lupa untuk mengaktifkan permintaan izin untuk notifikasi di browser anda, Jika Anda belum melihat permintaan izin untuk notifikasi,  tekan tombol "Aktifkan Notifikasi" lalu pilih "Allow" atau "Izinkan". Setelah tombol berubah menjadi "Notifikasi Aktif" anda akan mendapatkan notifikasi dari kami mengenai kontrol balik dan pengambilan obat.
              </p >
              <p className={`text-lg text-justify w-full ${permission === "granted" ? "" : "hidden"}`}>
              Untuk pengalaman terbaik dengan notifikasi dan pengalaman yang lebih baik, instal aplikasi kami sebagai Progressive Web App (PWA). Cukup klik tombol "Install PRB Care" di bawah ini dan ikuti panduan instalasinya. Terima kasih telah menggunakan aplikasi kami!
              </p>
            </div>
            <div className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
              <Button
                onClick={handleNotificationSetup}
                className="bg-lightGreen dark:bg-mainGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                disabled={permission === "granted"}
                label={
                  <div className="flex gap-2 justify-center items-center text-lg">
                    <Bell size={30} />
                    {permission === "granted"
                      ? "Notifikasi Aktif"
                      : "Aktifkan Notifikasi"}
                  </div>
                }
              />
              <Link
                to="/cara-instalasi-PWA"
                target="_blank"
                className="bg-lightGreen dark:bg-mainGreen w-full md:w-auto  flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
              >
                <div className="flex gap-2 text-lg justify-center items-center">
                  <TabletSmartphone size={30} />
                  <p>Install PRB Care</p>
                </div>
              </Link>
            </div>
          </div>
          <img src={img} className="md:w-1/3 min-[1980px]:w-1/4 md:block hidden" alt="img" />
          
        </div>
        
      </div>

      
    </div>
  );
};

export default HomePengguna;
