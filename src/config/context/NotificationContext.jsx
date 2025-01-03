import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { convertUnixToHumanHour } from "../../utils/DateConverter";

// contoh config, ganti konfigurasi firebase ini dengan milikmu sendiri
const firebaseConfig = {
  apiKey: "AIzaSyC39SjqXEGlXRS_L1rnXShncUScaH9XTp4",
  authDomain: "prbcare-b4b05.firebaseapp.com",
  projectId: "prbcare-b4b05",
  storageBucket: "prbcare-b4b05.firebasestorage.app",
  messagingSenderId: "192172579834",
  appId: "1:192172579834:web:a08abd10a89027f432a243",
  measurementId: "G-ST7G32LS2Q"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const DB_NAME = "fcm_notifications";

const NotificationContext = createContext();

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("notifications", {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };
  });
}

async function storeNotificationData(data) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["notifications"], "readwrite");
  const objectStore = transaction.objectStore("notifications");

  const notificationData = { data, isRead: false };

  const request = objectStore.add(notificationData);

  request.onerror = (event) =>
    console.error("Error storing notification:", event.target.error);
}

function convertUnixTimestampToLocalTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("id-ID", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleMessage = (payload) => {
      const {
        namaLengkap,
        namaApotek,
        namaPuskesmas,
        tanggalPengambilan,
        tanggalKontrol,
        tanggalBatal,
        tanggalMulai,
        tanggalSelesai,
      } = payload.data;

      let notificationTitle, notificationBody;
      let tanggalAmbilLocal = "";
      let tanggalBatalLocal = "";
      let tanggalMulaiLocal = "";
      let tanggalSelesaiLocal = "";

      if (namaApotek) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalPengambilan)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = "PRBCare - Ambil Obat";
        notificationBody = `${namaLengkap}, jadwal pengambilan obat anda di apotek ${namaApotek} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;
      } else if (namaPuskesmas && tanggalMulai && tanggalSelesai) {
        tanggalMulaiLocal = convertUnixToHumanHour(parseInt(tanggalMulai));
        tanggalSelesaiLocal = convertUnixToHumanHour(parseInt(tanggalSelesai));
        notificationTitle = "PRBCare - Prolanis";
        notificationBody = `Terdapat jadwal Prolanis pada ${tanggalMulaiLocal} sampai ${tanggalSelesaiLocal} di ${namaPuskesmas}. Silahkan hadir jika berkenan.`;
      } else if (namaPuskesmas && tanggalKontrol) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalKontrol)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = "PRBCare - Kontrol Balik";
        notificationBody = `${namaLengkap}, anda memiliki jadwal kontrol di puskesmas ${namaPuskesmas} pada ${tanggalAmbilLocal}. Pastikan datang pada jam operasional.`;
      }

      if (navigator.serviceWorker) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, {
            body: notificationBody,
            icon: "/assets/prbcare.png",
          });
        });
      }

      const notificationData = {
        title: notificationTitle,
        body: notificationBody,
        timestamp: Date.now(),
      };
      storeNotificationData(notificationData);

      setNotifications((prev) => [...prev, notificationData]);
    };

    const unsubscribe = onMessage(messaging, handleMessage);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
