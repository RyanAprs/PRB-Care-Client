import React, { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/pengguna/home",
        }
      );
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

const HomePengguna = () => {
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
    <div className="flex items-center justify-center h-screen dark:bg-blackHover dark:text-white">
      Home
    </div>
  );
};

export default HomePengguna;
