import img from "../../../assets/prbcare.svg";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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

const convertUnixTimestampToLocalTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("id-ID", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

const HomePengguna = () => {
  const [token, setToken] = useState("");
  const [permission, setPermission] = useState(Notification.permission);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (permission !== "granted") {
      setShowModal(true);
    }
  }, [permission]);

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

    if (permission === "granted") {
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

      // Convert timestamps to local time
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
  }, [permission]);

  const handleRequestPermission = () => {
    Notification.requestPermission().then((result) => {
      setPermission(result);
      if (result === "granted") {
        console.log("Notification permission granted.");
        setShowModal(false);
      } else {
        console.log("Notification permission denied.");
      }
    });
  };

  const handleUpdate = async () => {
    try {
      const data = { TokenPerangkat: token };
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
      <div className="flex md:w-1/2 w-full">
        <div className="flex flex-col justify-start items-center gap-10 md:p-12 p-4">
          <img src={img} className="md:hidden mt-10 w-4/5" alt="img" />
          <h1 className="md:text-6xl text-4xl font-semibold text-center md:px-5 md:text-start dark:text-whiteHover">
            Kesehatan Anda, Diujung Jari Anda.
          </h1>
          <h3 className="text-xl text-center md:px-5 md:text-start">
            PRB Care adalah aplikasi yang dirancang untuk membantu Anda
            mengingatkan kapan harus mengambil obat ke apotek dan kapan harus
            melakukan kontrol kesehatan ke puskesmas.
          </h3>
        </div>
        <button onClick={handleUpdate}>update token</button>
      </div>

      <img src={img} className="md:w-1/3 md:block hidden" alt="img" />
    </div>
  );
};

export default HomePengguna;
