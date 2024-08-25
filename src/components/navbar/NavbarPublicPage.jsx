import {useRef} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import {HomeIcon, Hospital, HousePlus, LogIn} from "lucide-react";
import {ThemeSwitcher} from "../themeSwitcher/ThemeSwitcher";
import {Toast} from "primereact/toast";
import {Ripple} from 'primereact/ripple';

const NavbarPublicPage = () => {
    const toast = useRef(null);

    return (
        <>
            <header
                className="font-poppins top-0 left-0 right-0 z-50 flex justify-between bg-white dark:bg-blackHover text-white items-center py-4 md:py-6 px-5 md:px-10 transition-colors duration-300 ">
                <Toast
                    ref={toast}
                    position={window.innerWidth <= 767 ? "top-center" : "top-right"}
                />
                <div className="flex items-center justify-center font-poppins text-2xl">
                    <img src={logo} width={60} height={60} alt="prb-care logo "/>
                    <div className="font-extrabold text-black dark:text-white">
                        PRBCare
                    </div>
                </div>

                <div className="flex gap-10 items-center text-xl ">
                    <div className="md:flex gap-10 items-center text-xl  hidden text-black dark:text-white">
                        <Link
                            to={"/"}
                            className="mx-auto transition-all flex flex-col items-center justify-center"
                        >
                            <h1
                                className={
                                    location.pathname === "/"
                                        ? "text-lightGreen dark:text-mainGreen"
                                        : ""
                                }
                            >
                                Beranda
                            </h1>
                        </Link>
                        <Link
                            to={"/data-puskesmas"}
                            className="mx-auto transition-all flex flex-col items-center justify-center"
                        >
                            <h1
                                className={
                                    location.pathname === "/data-puskesmas"
                                        ? "text-lightGreen dark:text-mainGreen"
                                        : ""
                                }
                            >
                                Puskesmas
                            </h1>
                        </Link>
                        <Link
                            to={"/data-apotek"}
                            className="mx-auto transition-all flex flex-col items-center justify-center"
                        >
                            <h1
                                className={
                                    location.pathname === "/data-apotek"
                                        ? "text-lightGreen dark:text-mainGreen"
                                        : ""
                                }
                            >
                                Apotek
                            </h1>
                        </Link>
                    </div>
                    <div className="relative flex gap-2 md:gap-2 items-center justify-center">
                        <ThemeSwitcher/>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Link
                                    to={"/pengguna/login"}
                                    className="p-1 rounded-full cursor-pointer p-ripple mx-auto transition-all flex flex-col items-center justify-center"
                                >
                                    <LogIn className="text-black dark:text-white"/>
                                    <Ripple/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className="fixed z-50 md:hidden bottom-0 left-0 right-0 dark:bg-blackHover bg-white dark:text-white shadow-lg p-3 px-4"
                style={{boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.05)"}}
            >
                <div className="flex  justify-between items-center mx-2">
                    <Link
                        to={"/"}
                        className={`flex flex-col items-center justify-center transition-all  ${
                            location.pathname === "/" ? "opacity-100" : "opacity-50"
                        }`}
                    >
                        <HomeIcon size={25}/>

                        <div className="text-sm">Beranda</div>
                    </Link>
                    <Link
                        to={"/data-puskesmas"}
                        className={`flex flex-col items-center justify-center transition-all  ${
                            location.pathname === "/data-puskesmas"
                                ? "opacity-100"
                                : "opacity-50"
                        }`}
                    >
                        <Hospital size={25}/>

                        <div className="text-sm">Puskesmas</div>
                    </Link>
                    <Link
                        to={"/data-apotek"}
                        className={`flex flex-col items-center justify-center transition-all  ${
                            location.pathname === "/data-apotek"
                                ? "opacity-100"
                                : "opacity-50"
                        }`}
                    >
                        <HousePlus size={25}/>

                        <div className="text-sm">Apotek</div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NavbarPublicPage;
