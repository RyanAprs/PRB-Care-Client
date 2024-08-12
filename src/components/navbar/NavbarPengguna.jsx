import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import {
  Bell,
  HomeIcon,
  LogOut,
  ShoppingCart,
  Stethoscope,
  UserIcon,
  UserPlus,
} from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AuthContext } from "../../config/context/AuthContext";

const NavbarPengguna = () => {
  const [clicked, setClicked] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    setClicked(true);
  };

  const handleModalMenu = () => {
    setVisible(true);
  };

  const handleModalLogout = () => {
    setVisibleLogout(true);
    setVisible(false);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/pengguna/login");
  };

  return (
    <>
      <header className="font-poppins top-0 left-0 right-0 z-50 flex justify-between dark:bg-blackHover dark:text-white items-center py-4 md:py-6 px-5 md:px-10 text-black shadow-lg transition-colors duration-300 ">
        <div className="flex items-center justify-center font-poppins text-2xl gap-2">
          <img src={logo} className="w-14 h-12 md:h-14 " alt="prb-care logo " />
          <div className="font-bold">PRB CARE</div>
        </div>

        <div className="flex gap-16 items-center text-xl font-semibold">
          <div className="md:flex gap-16 items-center text-xl hidden">
            <Link
              to={"/pengguna/home"}
              className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              <h1>Home</h1>
              <span
                className={`h-1 rounded-full bg-mainGreen transition-all ${
                  location.pathname === "/pengguna/home" && clicked
                    ? "w-full"
                    : "w-0"
                }`}
              ></span>
            </Link>
            <Link
              to="/pengguna/kontrol"
              className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              <h1>Kontrol</h1>
              <span
                className={`h-1 rounded-full bg-mainGreen transition-all ${
                  location.pathname === "/pengguna/kontrol" && clicked
                    ? "w-full"
                    : "w-0"
                }`}
              ></span>
            </Link>
            <Link
              to="/pengguna/obat"
              className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              <h1>Obat</h1>
              <span
                className={`h-1 rounded-full bg-mainGreen transition-all ${
                  location.pathname === "/pengguna/obat" && clicked
                    ? "w-full"
                    : "w-0"
                }`}
              ></span>
            </Link>
            <Link
              to="/pengguna/medis"
              className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              <h1>Medis</h1>
              <span
                className={`h-1 rounded-full bg-mainGreen transition-all ${
                  location.pathname === "/pengguna/medis" && clicked
                    ? "w-full"
                    : "w-0"
                }`}
              ></span>
            </Link>
            <Link
              to="/pengguna/notifikasi"
              className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              onClick={handleClick}
            >
              <h1>Notifikasi</h1>
              <span
                className={`h-1 rounded-full bg-mainGreen transition-all ${
                  location.pathname === "/pengguna/notifikasi" && clicked
                    ? "w-full"
                    : "w-0"
                }`}
              ></span>
            </Link>
          </div>
          <div className="relative flex gap-2 md:gap-8 items-center justify-center">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <button
                onClick={handleModalMenu}
                className="cursor-pointer p-3 bg-gray-300 rounded-full"
              >
                <UserIcon className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed z-50 md:hidden  bottom-0 left-0 right-0 dark:bg-blackHover dark:text-white shadow-xl p-3 px-4">
        <div className="flex  justify-between items-center ">
          <Link
            to={"/pengguna/home"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/home"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <HomeIcon size={25} />
            <div className="text-sm">Home</div>
          </Link>
          <Link
            to="/pengguna/kontrol"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/kontrol"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <Stethoscope />
            <div className="text-sm">Kontrol</div>
          </Link>
          <Link
            to="/pengguna/obat"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/obat"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <ShoppingCart />
            <div className="text-sm">Obat</div>
          </Link>
          <Link
            to="/pengguna/medis"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/medis"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <UserPlus />
            <div className="text-sm">Medis</div>
          </Link>
          <Link
            to="/pengguna/notifikasi"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/pengguna/notifikasi"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <Bell />
            <div className="text-sm">Notifikasi</div>
          </Link>
        </div>

        {/* Modal Menu */}
        <Dialog
          header="Menu"
          visible={visible}
          className="fixed top-20 md:right-8 right-1 w-1/2 md:w-64"
          modal={false}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <div className="flex flex-col text-lg ">
            <Link
              to="/pengguna/profile"
              className="mb-4 w-full flex gap-4"
              onClick={() => setVisible(false)}
            >
              <h1>Akun</h1>
            </Link>
            <Link
              to=""
              className="mb-4 w-full flex gap-4"
              onClick={handleModalLogout}
            >
              <h1>Keluar</h1>
            </Link>
          </div>
        </Dialog>

        {/* Modal Logout */}
        <Dialog
          header="Logout"
          visible={visibleLogout}
          className="md:w-1/2 w-full "
          onHide={() => {
            if (!visibleLogout) return;
            setVisibleLogout(false);
            setVisible(false);
          }}
        >
          <div className="flex flex-col gap-8">
            <div className="text-xl">
              Apakah anda yakin ingin keluar dari sistem?
            </div>
            <div className="flex gap-4 items-end justify-end">
              <Button
                label="Batal"
                onClick={() => setVisibleLogout(false) || setVisible(false)}
                className="p-button-text"
              />
              <Button
                label="Keluar"
                className="rounded-xl"
                onClick={handleLogout}
                autoFocus
              />
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default NavbarPengguna;
