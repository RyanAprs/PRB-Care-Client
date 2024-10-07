import img from "../../../assets/home.png";
import {useEffect, useRef} from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { Ripple } from "primereact/ripple";
import { useInstallPrompt } from "../../../config/context/InstallPromptContext.jsx";
import useDarkMode from "use-dark-mode";
import { motion } from "framer-motion";
import { Toast } from "primereact/toast";
import {useNotificationSetup} from "../../../config/context/NotificationSetupContext.jsx";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const HomePengguna = () => {
    const toast = useRef(null);
    const { permission, handleNotificationSetup } = useNotificationSetup();
    const { installPromptEvent, promptInstall } = useInstallPrompt();
    const darkMode = useDarkMode(false, { classNameDark: "dark" });
    useEffect(() => {
        if (localStorage.getItem("isLogin") === "true") {
            handleNotificationSetup();
            localStorage.removeItem("isLogin");
        }
    }, []);

    const handleToast= () => {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Izin notifikasi diblokir. Lakukan unblock izin notifikasi di pengaturan.",
            life: 3000,
        })
    }

    return (
        <div className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
            <Toast
                ref={toast}
                position={window.innerWidth <= 767 ? "top-center" : "top-right"}
            />
            <div className="flex w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center">
                <div className="md:p-8 p-6 flex md:justify-center justify-start items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.6, delay: 0.2 }}
                        variants={fadeInUp}
                        className="flex flex-col justify-start items-center gap-4 md:w-1/2 md:mr-10"
                    >
                        <img src={img} className="md:hidden w-4/5" alt="img" />
                        <h1 className="md:text-6xl text-4xl font-semibold dark:text-whiteHover">
                            {permission !== "granted" || installPromptEvent !== null
                                ? "Selamat Datang Ikuti Instruksi di Bawah Ini untuk Memulai"
                                : "Anda Telah Bergabung dengan PRBCare"}
                        </h1>
                        <div className="flex flex-col items-center">
                            <p className={`text-lg text-justify w-full ${permission === "granted" ? "hidden" : ""}`}>
                                Jangan lupa untuk mengaktifkan permintaan izin untuk notifikasi
                                di browser anda, Jika Anda belum melihat permintaan izin untuk
                                notifikasi, tekan tombol "Aktifkan Notifikasi" lalu pilih
                                "Allow" atau "Izinkan".
                            </p>
                            <p className={`text-lg text-justify w-full ${permission !== "granted" || installPromptEvent === null ? "hidden" : ""}`}>
                                Untuk pengalaman terbaik dengan aplikasi PRBCare, install aplikasi sebagai Progressive
                                Web App (PWA). Cukup
                                klik tombol "Install PRBCare" di bawah ini, lalu pilih
                                "Install" untuk menambahkan aplikasi ke perangkat Anda.
                            </p>
                            <p className={`text-lg text-justify w-full ${permission !== "granted" || installPromptEvent !== null ? "hidden" : ""}`}>
                                Terima kasih telah bergabung dengan PRBCare! Untuk memulai, silahkan
                                cari puskesmas terdaftar PRBCare terdekat dengan lokasi Anda. Hubungi
                                puskesmas melalui nomor yang tertera, dan pihak puskesmas akan
                                memberikan nomor antrean untuk Anda. Jika Anda membutuhkan
                                bantuan lebih lanjut, jangan ragu untuk menghubungi kami.
                            </p>
                        </div>
                        <div className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
                            {permission === "granted" && installPromptEvent === null ? (
                                <div className="flex md:flex-row flex-col gap-2 md:w-auto w-full">
                                    <Link to="/data-puskesmas" className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl">
                                        <div className="flex gap-2 justify-center items-center text-lg">
                                            Cari Puskesmas
                                        </div>
                                        <Ripple />
                                    </Link>
                                    <Link to="/data-apotek" className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl">
                                        <div className="flex gap-2 justify-center items-center text-lg">
                                            Cari Apotek
                                        </div>
                                        <Ripple />
                                    </Link>
                                    <Link to="/artikel" className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl">
                                        <div className="flex gap-2 justify-center items-center text-lg ">
                                            Artikel Kesehatan
                                        </div>
                                        <Ripple />
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => permission !== "denied"
                                            ? (
                                                localStorage.setItem("needRegisterDevice", "true"),
                                                    handleNotificationSetup()
                                            )
                                            : handleToast()
                                        }
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
                        transition={{ duration: 0.6, delay: 0.2 }}
                        variants={fadeInUp}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePengguna;