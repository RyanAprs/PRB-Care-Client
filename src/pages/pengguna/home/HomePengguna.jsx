import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";
import img from "../../../assets/home-img.png";

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
    <div className="flex md:flex-row flex-col items-center  md:justify-center h-screen dark:bg-black dark:text-white md:px-28 px-4 gap-4">
      <div className="flex  md:w-1/2 w-full">
        <div className="flex flex-col justify-start items-start gap-10 md:p-12 p-4">
          <h1 className="md:text-6xl text-4xl font-semibold text-darkColor dark:text-whiteHover">
            Kesehatan Anda, Diujung Jari Anda.
          </h1>
          <h3 className="text-xl">
            PRB Care adalah aplikasi yang dirancang untuk membantu Anda
            mengingatkan kapan harus mengambil obat ke apotek dan kapan harus
            melakukan kontrol kesehatan ke puskesmas.
          </h3>
        </div>
      </div>
      <div className="flex  md:w-1/2 justify-center items-center">
        <img src={img} alt="img" />
      </div>
    </div>
  );
};

export default HomePengguna;
