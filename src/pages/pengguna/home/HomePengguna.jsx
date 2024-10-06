import img from "../../../assets/home.png";
import {useRef, useState} from "react";
import {Button} from "primereact/button";
import {getMessaging, getToken} from "firebase/messaging";
import {initializeApp} from "firebase/app";
import {updateCurrentTokenPerangkatPengguna} from "../../../services/PenggunaService";
import {Link} from "react-router-dom";
import {Ripple} from "primereact/ripple";
import {useInstallPrompt} from "../../../config/context/InstallPromptContext.jsx";
import useDarkMode from "use-dark-mode";
import {motion} from "framer-motion";
import {Toast} from "primereact/toast";

const VITE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;
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

const fadeInUp = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0}
};

const HomePengguna = () => {
    const toast = useRef(null);
    const [permission, setPermission] = useState(
        typeof Notification !== "undefined" ? Notification.permission : "granted"
    );
    const {installPromptEvent, promptInstall} = useInstallPrompt();
    const darkMode = useDarkMode(false, {classNameDark: "dark"});

    const handleNotificationSetup = async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            setPermission("granted");
            return;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === "granted") {
                if ("serviceWorker" in navigator) {
                    const registration = await navigator.serviceWorker.register(
                        "/firebase-messaging-sw.js", {scope: "/"}
                    );

                    const currentToken = await getToken(messaging, {
                        vapidKey: `${VITE_VAPID_KEY}`,
                        serviceWorkerRegistration: registration,
                    });

                    if (currentToken) {
                        await handleUpdate(currentToken);
                    } else {
                        console.log("No registration token available.");
                    }
                }
            } else if (result === "denied") {
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Izin notifikasi diblokir. Lakukan unblock izin notifikasi di pengaturan.",
                    life: 3000,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async (currentToken) => {
        try {
            const data = {TokenPerangkat: currentToken};
            const response = await updateCurrentTokenPerangkatPengguna(data);
            if (response.status === 200) {
                console.log(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (localStorage.getItem("isLogin") === "true") {
        handleNotificationSetup();
        localStorage.removeItem("isLogin");
    }

    return (
        <div
            className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
            <Toast
                ref={toast}
                position={window.innerWidth <= 767 ? "top-center" : "top-right"}
            />
            <div
                className="flex w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center"
            >
                <div className="md:p-8 p-6 flex md:justify-center justify-start items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        transition={{duration: 0.6, delay: 0.2}}
                        variants={fadeInUp}
                        className="flex flex-col justify-start items-center gap-4 md:w-1/2 md:mr-10"
                    >
                        <img src={img} className="md:hidden w-4/5" alt="img"/>
                        <h1 className="md:text-6xl text-4xl font-semibold dark:text-whiteHover">
                            {permission !== "granted" || installPromptEvent !== null
                                ? "Selamat Datang Ikuti Instruksi di Bawah Ini untuk Memulai"
                                : "Anda Telah Bergabung dengan PRBCare"}
                        </h1>
                        <div className="flex flex-col items-center">
                            <p
                                className={`text-lg text-justify w-full  ${
                                    permission === "granted" ? "hidden" : ""
                                }`}
                            >
                                Jangan lupa untuk mengaktifkan permintaan izin untuk notifikasi
                                di browser anda, Jika Anda belum melihat permintaan izin untuk
                                notifikasi, tekan tombol "Aktifkan Notifikasi" lalu pilih
                                "Allow" atau "Izinkan".
                            </p>
                            <p
                                className={`text-lg text-justify w-full  ${
                                    permission !== "granted" || installPromptEvent === null
                                        ? "hidden"
                                        : ""
                                }`}
                            >
                                Untuk pengalaman terbaik dengan aplikasi PRBCare, install aplikasi sebagai Progressive
                                Web App (PWA). Cukup
                                klik tombol "Install PRBCare" di bawah ini, lalu pilih
                                "Install" untuk menambahkan aplikasi ke perangkat Anda.
                            </p>
                            <p
                                className={`text-lg text-justify w-full  ${
                                    permission !== "granted" || installPromptEvent !== null
                                        ? "hidden"
                                        : ""
                                }`}
                            >
                                Terima kasih telah bergabung dengan PRBCare! Untuk memulai, silahkan
                                cari puskesmas terdaftar PRBCare terdekat dengan lokasi Anda. Hubungi
                                puskesmas melalui nomor yang tertera, dan pihak puskesmas akan
                                memberikan nomor antrean untuk Anda. Jika Anda membutuhkan
                                bantuan lebih lanjut, jangan ragu untuk menghubungi kami.
                            </p>
                        </div>
                        <div
                            className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
                            {permission === "granted" && installPromptEvent === null ? (
                                <div className="flex md:flex-row flex-col gap-2 md:w-auto w-full">
                                    <Link
                                        to="/data-puskesmas"
                                        className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                                    >
                                        <div className="flex gap-2 justify-center items-center text-lg">
                                            Cari Puskesmas
                                        </div>
                                        <Ripple/>
                                    </Link>
                                    <Link
                                        to="/data-apotek"
                                        className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                                    >
                                        <div className="flex gap-2 justify-center items-center text-lg">
                                            Cari Apotek
                                        </div>
                                        <Ripple/>
                                    </Link>
                                    <Link
                                        to="/artikel"
                                        className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                                    >
                                        <div className="flex gap-2 justify-center items-center text-lg ">
                                            Artikel Kesehatan
                                        </div>
                                        <Ripple/>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleNotificationSetup}
                                        className={`${permission === "granted" ? "hidden" : ""} bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                                        label={
                                            <div className="flex gap-2 justify-center items-center text-lg">
                                                Aktifkan Notifikasi
                                            </div>
                                        }
                                    />
                                    <Button
                                        onClick={promptInstall}
                                        className={`${permission !== "granted" || installPromptEvent === null ? "hidden" : ""} bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl`}
                                        label={
                                            <div className="flex gap-2 justify-center items-center text-lg">
                                                Install PRBCare
                                            </div>
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                    <motion.img
                        src={img}
                        className="md:w-1/4 min-[1980px]:w-1/4 md:block hidden"
                        alt="img"
                        initial="hidden"
                        whileInView="visible"
                        transition={{duration: 0.6, delay: 0.2}}
                        variants={fadeInUp}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePengguna;
