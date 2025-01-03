import { createContext, useContext, useState, useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { updateCurrentTokenPerangkatPengguna } from "@/services/PenggunaService.js";
import { ProgressSpinner } from "primereact/progressspinner"; 

const VITE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
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

const NotificationSetupContext = createContext();

export const useNotificationSetup = () => useContext(NotificationSetupContext);

export const NotificationSetupProvider = ({ children }) => {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "granted"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("needRegisterDevice") === "true" &&
      Notification.permission !== "denied"
    ) {
      handleNotificationSetup();
    }
  }, []);

  const handleNotificationSetup = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      setPermission("granted");
      return;
    }

    try {
      if (Notification.permission === "granted") {
        setPermission(Notification.permission);
      } else {
        const result = await Notification.requestPermission();
        setPermission(result);
      }

      if (Notification.permission === "granted") {
        if ("serviceWorker" in navigator) {
          setLoading(true); 
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/" }
          );
          await navigator.serviceWorker.ready;
          const currentToken = await getToken(messaging, {
            vapidKey: `${VITE_VAPID_KEY}`,
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            const updateSuccess = await handleUpdate(currentToken);

            if (updateSuccess) {
              localStorage.removeItem("needRegisterDevice");
            }
          } else {
            console.log("No registration token available.");
          }
          setLoading(false);
        }
      } else if (Notification.permission === "denied") {
        setPermission("denied");
        console.log("Notification permission denied");
      }
    } catch (error) {
      console.log("Error in handleNotificationSetup:", error);
      setLoading(false); 
    }
  };

  const handleUpdate = async (currentToken) => {
    try {
      const data = { TokenPerangkat: currentToken };
      const response = await updateCurrentTokenPerangkatPengguna(data);
      if (response.status === 200) {
        console.log("Token updated successfully:", response.data);
        return true;
      } else {
        console.log("Token update failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.log("Error in handleUpdate:", error);
      return false;
    }
  };

  return (
    <NotificationSetupContext.Provider
      value={{ permission, handleNotificationSetup }}
    >
      {children}
      {useEffect(() => {
        if (loading) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
        return () => {
          document.body.style.overflow = "";
        };
      }, [loading])}
  
      {loading && (
        <div
          className={`fixed flex item-center justify-center bg-[#ffffff] dark:bg-[#1e1e1e]`}
          data-pc-section="mask"
          style={{
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg">Tunggu Sebentar</p>
            <ProgressSpinner />
            <p className="text-lg">Menyiapkan Akun Anda</p>
          </div>
        </div>
      )}
    </NotificationSetupContext.Provider>
  );
};
