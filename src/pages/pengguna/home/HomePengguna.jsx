import { ArrowBigRight, Bell } from "lucide-react";
import img from "../../../assets/prbcare.svg";
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
    <div className="flex md:flex-row flex-col items-center md:justify-center min-h-screen h-fit dark:bg-black bg-whiteGrays dark:text-white md:px-40 px-4 gap-4">
      <div className="flex w-full">
        <div className="flex flex-col justify-start items-center gap-10 md:p-12 p-4">
          <img src={img} className="md:hidden mt-10 w-4/5" alt="img" />
          <h1 className="md:text-6xl text-4xl font-semibold text-center md:text-start dark:text-whiteHover">
            Kesehatan Anda, Diujung Jari Anda.
          </h1>

          <div className="flex flex-col items-center gap-2">
            <p className="text-lg text-center md:text-start w-full">
              Aktifkan notifikasi, Ketika anda mengklik tombol ini, aplikasi
              akan meminta izin untuk mengaktifkan notifikasi pada perangkat
              mereka.
            </p>
            <p className="text-lg text-center md:text-start w-full">
              Install PWA, Tombol ini akan mengarahkan anda ke halaman yang
              menjelaskan cara menginstal aplikasi sebagai Progressive Web App
              (PWA).
            </p>
          </div>

          <div className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
            <Button
              onClick={handleNotificationSetup}
              className="bg-mainGreen w-full md:w-auto flex items-center justify-center gap-2 hover:bg-darkGreen transition-all text-white p-4 rounded"
              disabled={permission === "granted"}
              label={
                <div className="flex gap-2 justify-center items-center text-lg">
                  <Bell size={30} />
                  {permission === "granted"
                    ? "Notifikasi sudah aktif"
                    : "Aktifkan Notifikasi"}
                </div>
              }
            />

            <Link
              to="/cara-instalasi-PWA"
              className="bg-mainGreen w-full md:w-auto flex items-center justify-center gap-2 hover:bg-darkGreen transition-all text-white p-4 rounded"
            >
              <div className="flex gap-2 text-lg justify-center items-center">
                <ArrowBigRight size={30} />
                <p>Cara install PWA</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <img src={img} className="md:w-1/3 md:block hidden" alt="img" />
    </div>
  );
};

export default HomePengguna;
