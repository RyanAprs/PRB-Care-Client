import LoginForm from "../../../components/form/LoginForm";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";

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

const convertUnixTimestampToLocalTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("id-ID", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};
const LoginPengguna = () => {
  const API_URI = `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/login`;
  const [token, setToken] = useState("");

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
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
            setToken(currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      }
    };

    if (Notification.permission === "granted") {
      registerServiceWorker();
    }

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);

      const {
        title,
        namaLengkap,
        namaApotek,
        namaPuskesmas,
        tanggalPengambilan,
        tanggalKontrol,
        tanggalBatal,
      } = payload.data;

      let tanggalAmbilLocal, tanggalBatalLocal;
      let notificationTitle, notificationBody;

      if (namaApotek) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalPengambilan)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = title;
        notificationBody = `${namaLengkap}, jadwal pengambilan obat Anda di apotek ${namaApotek} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pilih waktu dalam jam operasional.`;
      } else if (namaPuskesmas) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalKontrol)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = title;
        notificationBody = `${namaLengkap}, jadwal kontrol balik Anda di puskesmas ${namaPuskesmas} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pilih waktu dalam jam operasional.`;
      }

      const notificationOptions = {
        body: notificationBody,
      };
      new Notification(notificationTitle, notificationOptions);
    });
  }, [token]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <LoginForm
        API_URI={API_URI}
        navigateUser="/"
        role="pengguna"
        title="Pengguna"
        tokenPerangkat={token}
      />
    </div>
  );
};

export default LoginPengguna;
