import {Link} from "react-router-dom";
import img from "../../../assets/prbcare.svg";
import {useContext} from "react";
import {AuthContext} from "../../../config/context/AuthContext";
import {Ripple} from 'primereact/ripple';

const Home = () => {
    const {token, role} = useContext(AuthContext);
    return (
        <div
            className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
            <div className="flex w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center">
                <div className="p-8 flex  md:justify-center justify-start items-center gap-7">
                    <div className="flex flex-col justify-start items-center gap-7 md:w-1/2">
                        <img src={img} className="md:hidden w-4/5" alt="img"/>
                        <h1 className="md:text-6xl text-3xl font-semibold text-justify md:text-start dark:text-whiteHover">
                            Kesehatan Anda, di Ujung Jari Anda.
                        </h1>
                        <div className="flex flex-col items-center">
                            <p className="text-lg text-justify w-full">
                                PRBCare adalah solusi kesehatan digital Anda yang memastikan
                                Anda tidak pernah melewatkan waktu penting. Dapatkan notifikasi
                                otomatis untuk pengambilan obat dan jadwal kontrol balik,
                                sehingga Anda selalu tepat waktu dalam menjaga kesehatan Anda.
                            </p>
                        </div>
                        <div
                            className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
                            {token && role === "pengguna" ? (<Link
                                to="/pengguna/beranda"
                                className="p-ripple bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                            >
                                <div className="flex gap-2 justify-center items-center text-lg">
                                    Jelajahi sekarang
                                </div>
                                <Ripple/>
                            </Link>) : (<Link
                                to="/pengguna/register"
                                className="p-ripple bg-mainGreen  dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                            >
                                <div className="flex gap-2 justify-center items-center text-lg">
                                    Mulai Bergabung
                                </div>
                                <Ripple/>
                            </Link>)}

                        </div>
                    </div>
                    <img
                        src={img}
                        className="md:w-1/3 min-[1980px]:w-1/4 md:block hidden"
                        alt="img"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;