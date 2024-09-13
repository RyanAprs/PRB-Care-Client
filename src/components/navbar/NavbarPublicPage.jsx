import { useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import {
  HomeIcon,
  Hospital,
  HousePlus,
  LogIn,
  ScrollText,
} from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from 'react-router-dom';
const NavbarPublicPage = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/pengguna/login');
  };
  return (
    <>
      <header className="font-poppins top-0 left-0 right-0 z-50 flex justify-between bg-white dark:bg-blackHover text-white items-center py-4 md:py-6 px-5 md:px-10 transition-colors duration-300 ">
        <Toast
          ref={toast}
          position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="flex items-center justify-center font-poppins text-2xl">
          <img src={logo} width={60} height={60} alt="prb-care logo " />
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
                    ? "dark:text-lightGreen text-mainGreen"
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
                    ? "dark:text-lightGreen text-mainGreen"
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
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Apotek
              </h1>
            </Link>
            <Link
              to={"/artikel"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/artikel"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Artikel
              </h1>
            </Link>
          </div>
          <div className="relative flex gap-2 md:gap-2 items-center justify-center">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                    text
                    className="p-1 rounded-full cursor-pointer text-black dark:text-white"
                    severity={`secondary`}
                    onClick={handleClick}
                ><LogIn strokeWidth={1.5} /></Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className="fixed z-50 md:hidden -bottom-1 left-0 right-0 dark:bg-blackHover bg-white dark:text-white shadow-lg p-3 px-8"
        style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.05)" }}
      >
        <div className="flex  justify-between items-center mx-2">
          <Link
            to={"/"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/" ? "opacity-100" : "opacity-50"
            }`}
          >
            <HomeIcon size={25} />

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
            <Hospital size={25} />

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
            <HousePlus size={25} />

            <div className="text-sm">Apotek</div>
          </Link>
          <Link
            to={"/artikel"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/artikel" ? "opacity-100" : "opacity-50"
            }`}
          >
            <ScrollText size={25} />

            <div className="text-sm">Artikel</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavbarPublicPage;
