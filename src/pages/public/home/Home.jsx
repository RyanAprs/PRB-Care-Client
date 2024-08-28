import { Link } from "react-router-dom";
import img from "../../../assets/beranda.png";
import img2 from "../../../assets/prbcare.svg";
import { useContext } from "react";
import { AuthContext } from "../../../config/context/AuthContext";
import { Ripple } from 'primereact/ripple';

const Home = () => {
    const { token, role } = useContext(AuthContext);
    return (
        <div className="flex md:p-4 p-2 md:flex-row flex-col items-center md:justify-center min-h-fit h-full dark:bg-black bg-whiteGrays dark:text-white gap-4">
            <div className="flex flex-col w-full md:min-h-screen bg-white dark:bg-blackHover rounded-xl md:items-center ">
                {/* Hero Section */}
                <div className="p-8 flex md:justify-center justify-start items-center  md:min-h-screen max-h-fit">
                    <div className="flex flex-col justify-start items-center gap-7 md:w-1/2">
                        <img src={img} className="md:hidden w-4/5" alt="img" />
                        <h1 className="md:text-6xl text-3xl font-semibold text-justify md:text-start dark:text-whiteHover">
                            Kesehatan Anda, di Ujung Jari Anda.
                        </h1>
                        <div className="flex flex-col items-center">
                            <p className="text-lg text-justify w-full md:pr-10">
                                PRBCare adalah solusi kesehatan digital Anda yang memastikan
                                Anda tidak pernah melewatkan waktu penting. Dapatkan notifikasi
                                otomatis untuk pengambilan obat dan jadwal kontrol balik,
                                sehingga Anda selalu tepat waktu dalam menjaga kesehatan Anda.
                            </p>
                        </div>
                        <div className="text-xl md:text-start flex md:flex-row flex-col justify-start items-center gap-4 w-full">
                            {token && role === "pengguna" ? (
                                <Link
                                    to="/pengguna/beranda"
                                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                                >
                                    <div className="flex gap-2 justify-center items-center text-lg">
                                        Jelajahi sekarang
                                    </div>
                                    <Ripple />
                                </Link>
                            ) : (
                                <Link
                                    to="/pengguna/register"
                                    className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                                >
                                    <div className="flex gap-2 justify-center items-center text-lg">
                                        Mulai Bergabung
                                    </div>
                                    <Ripple />
                                </Link>
                            )}
                        </div>
                    </div>
                    <img src={img} className="md:w-1/3 min-[1980px]:w-1/4 md:block hidden" alt="img" />
                </div>

                <div className="p-8 w-full flex flex-col items-center gap-7 bg-gray-100 dark:bg-[#0c0c0c] md:py-20 ">
                    <h2 className="text-3xl font-semibold dark:text-whiteHover">Fitur Utama Kami</h2>
                    <div className="flex flex-wrap w-full justify-center gap-10 ">
                        <div className="bg-white dark:bg-blackHover p-6 rounded-xl shadow-lg text-center max-w-xs">
                            <h3 className="text-xl font-semibold mb-3">Pengingat Jadwal Kontrol dan Ambil Obat</h3>
                            <p>fitur pengingat
                                otomatis terkait jadwal pengambilan obat ataupun kontrol balik.</p>
                        </div>
                        <div className="bg-white dark:bg-blackHover p-6 rounded-xl shadow-lg text-center max-w-xs">
                            <h3 className="text-xl font-semibold mb-3">Kemudahan Kontrol Kesehatan</h3>
                            <p>Akses informasi mengenai hasil pemeriksaan serta pengambilan
                                obat dengan mudah.</p>
                        </div>
                        <div className="bg-white dark:bg-blackHover p-6 rounded-xl shadow-lg text-center max-w-xs">
                            <h3 className="text-xl font-semibold mb-3">Laporan Kesehatan Terintegrasi</h3>
                            <p>Akses langsung ke data rekam medis kapan saja melalui aplikasi kami yang
                                terintegrasi.</p>
                        </div>

                    </div>
                </div>


                <div className="p-8 flex md:justify-center justify-start items-center  md:min-h-screen max-h-fit">
                    <img src={img2} className="md:w-1/3 min-[1980px]:w-1/4 md:block hidden mr-10" alt="img"/>
                    <div className="flex flex-col justify-start items-center gap-7 md:w-1/2">
                        <img src={img2} className="md:hidden w-4/5" alt="img"/>
                        <h1 className="md:text-6xl text-3xl font-semibold text-justify md:text-start dark:text-whiteHover">
                            Bergabung Menjadi Mitra PRBCare.
                        </h1>
                        <div className="flex flex-col items-center">
                            <p className="text-lg text-justify w-full ">
                                PRBCare hadir untuk mempermudah pengelolaan apotek dan puskesmas Anda. Untuk puskesmas, kami menawarkan fitur unggulan seperti manajemen pasien, kontrol balik, dan pengambilan obat. Bagi apotek, PRBCare menyederhanakan pengelolaan stok obat dan pengambilan obat. Bergabunglah dengan kami dan tingkatkan kualitas layanan kesehatan Anda.
                            </p>
                        </div>
                        <div
                            className="text-xl md:text-start flex md:flex-row flex-col items-center gap-4 w-full">
                            <Link
                                to="#"
                                className="p-ripple bg-mainGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen w-full md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                            >
                                <div className="flex gap-2 justify-center items-center text-lg">
                                    Kontak Kami
                                </div>
                                <Ripple/>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Home;