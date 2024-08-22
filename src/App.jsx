import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PenggunaRoute from "./config/routes/PenggunaRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import { AuthContextProvider } from "./config/context/AuthContext";
import NotFound from "./pages/NotFound";
import PublicRoute from "./config/routes/PublicRoute";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { useEffect } from "react";

window.global = window;

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

const DB_NAME = "fcm_notifications";
let db;

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
      db = event.target.result;
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

  const request = objectStore.add({ data });

  request.onsuccess = () => console.log("Notification stored in IndexedDB");
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

function App() {
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
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);

      const {
        title,
        namaLengkap,
        namaApotek,
        namaPuskesmas,
        tanggalPengambilan,
        tanggalKontrol,
        tanggalBatal,
      } = payload.data;

      let notificationTitle, notificationBody;
      let tanggalAmbilLocal = "";
      let tanggalBatalLocal = "";

      if (namaApotek) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalPengambilan)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = title;
        notificationBody = `${namaLengkap}, jadwal pengambilan obat anda di apotek ${namaApotek} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;
      } else if (namaPuskesmas) {
        tanggalAmbilLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalKontrol)
        );
        tanggalBatalLocal = convertUnixTimestampToLocalTime(
          parseInt(tanggalBatal)
        );
        notificationTitle = title;
        notificationBody = `${namaLengkap}, jadwal kontrol balik anda  di puskesmas ${namaPuskesmas} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;
      }

      const notificationData = {
        title: notificationTitle,
        body: notificationBody,
        timestamp: Date.now(),
      };

      storeNotificationData(notificationData);

      const notificationOptions = {
        body: notificationBody,
      };

      new Notification(notificationTitle, notificationOptions);
    });
  }, []);

  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<PublicRoute />} />
          <Route path="/pengguna/*" element={<PenggunaRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/puskesmas/*" element={<PuskesmasRoute />} />
          <Route path="/apotek/*" element={<ApotekRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
