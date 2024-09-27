import LoginForm from "../../../components/form/LoginForm";
import {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";


const LoginPengguna = () => {
    const API_URI = `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/login`;

    const [showToast, setShowToast] = useState(false);
    const toastLogin = useRef(null);
    useEffect(() => {
        if (localStorage.getItem("isRegistered") === "true") {
            setShowToast(true);
            localStorage.removeItem("isRegistered");
        }
    }, []);
    useEffect(() => {
        if (showToast) {
            toastLogin.current.show({
                severity: "success",
                summary: "Berhasil",
                detail: "Berhasil melakukan register, silahkan login",
                life: 3000,
            });
            setShowToast(false);
        }
    }, [showToast]);
    return (
        <div className="min-h-screen w-full flex justify-center items-center md:p-0 px-8">
            <Toast
                ref={toastLogin}
                position={window.innerWidth <= 767 ? "top-center" : "top-right"}
            />
            <LoginForm
                API_URI={API_URI}
                navigateUser="/pengguna/beranda"
                role="pengguna"
                title="Pengguna"
            />
        </div>
    );
};

export default LoginPengguna;
