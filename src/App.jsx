import React, { useEffect, useState } from "react";
import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import UserRoute from "./config/routes/UserRoute";
import { AdminAuthContextProvider } from "./config/context/AdminAuthContext";
import { PuskesmasAuthContextProvider } from "./config/context/PuskesmasAuthContext";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { ApotekAuthContextProvider } from "./config/context/ApotekAuthContext";
import { UserAuthContextProvider } from "./config/context/UserAuthContext";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );
      console.log("Service Worker registered with scope:", registration.scope);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

function App() {
  const [token, setToken] = useState();

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging);

        if (token) {
          console.log("Token generated:", token);
          setToken(token);
        } else {
          console.log(
            "No registration token available. Request permission to generate one"
          );
        }
      } catch (error) {
        console.error("Error getting token", error);
      }
    };

    requestPermission();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received ", payload);
      const { notification } = payload;

      const notificationTitle = notification.title;
      const notificationOptions = {
        body: notification.body,
      };

      if (Notification.permission === "granted") {
        new Notification(notificationTitle, notificationOptions);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="font-poppins">
      <AdminAuthContextProvider>
        <AdminRoute />
      </AdminAuthContextProvider>

      <PuskesmasAuthContextProvider>
        <PuskesmasRoute />
      </PuskesmasAuthContextProvider>

      <ApotekAuthContextProvider>
        <ApotekRoute />
      </ApotekAuthContextProvider>

      <UserAuthContextProvider>
        <UserRoute />
      </UserAuthContextProvider>

      {/* <div className="p-48 w-full flex items-center justify-center">
        {token}
      </div> */}
    </div>
  );
}

export default App;
