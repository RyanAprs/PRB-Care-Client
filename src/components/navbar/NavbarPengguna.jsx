import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import {
  Bell,
  HomeIcon,
  ShoppingCart,
  Stethoscope,
  UserIcon,
  UserPlus,
} from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AuthContext } from "../../config/context/AuthContext";
import Cookies from "js-cookie";

const NavbarPengguna = () => {
  const { dispatch } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleMasukAkun, setVisibleMasukAkun] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = Cookies.get("token");

  const handleModalMenu = () => {
    setVisible(true);
  };

  const handleModalMasukAkun = () => {
    setVisibleMasukAkun(true);
  };

  const handleModalLogout = () => {
    setVisibleLogout(true);
    setVisible(false);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <>
      <header className="font-poppins top-0 left-0 right-0 z-50 flex justify-between dark:bg-black dark:text-white items-center py-4 md:py-6 px-5 md:px-10 text-black shadow-lg transition-colors duration-300 ">
        <div className="flex items-center justify-center font-poppins text-2xl gap-2">
          <img src={logo} className="w-14 h-12 md:h-14 " alt="prb-care logo " />
          <div className="font-bold">PRB CARE</div>
        </div>

        <div className="flex gap-16 items-center text-xl font-semibold">
          {token && (
            <div className="md:flex gap-16 items-center text-xl hidden">
              <Link
                to={"/"}
                className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              >
                <h1>Beranda</h1>
                <span className="h-1 rounded-full bg-mainGreen transition-all"></span>
              </Link>
              <Link
                to="/kontrol"
                className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              >
                <h1>Kontrol</h1>
                <span className="h-1 rounded-full bg-mainGreen transition-all "></span>
              </Link>
              <Link
                to="/obat"
                className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              >
                <h1>Obat</h1>
                <span className="h-1 rounded-full bg-mainGreen transition-all "></span>
              </Link>
              <Link
                to="/medis"
                className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              >
                <h1>Medis</h1>
                <span className="h-1 rounded-full bg-mainGreen transition-all "></span>
              </Link>
              <Link
                to="/notifikasi"
                className=" transition-all hover:scale-110 flex flex-col items-center justify-center"
              >
                <h1>Notifikasi</h1>
                <span className="h-1 rounded-full bg-mainGreen transition-all "></span>
              </Link>
            </div>
          )}
          <div className="relative flex gap-2 md:gap-8 items-center justify-center">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <button
                onClick={token ? handleModalMenu : handleModalMasukAkun}
                className="cursor-pointer "
              >
                {token ? (
                  <div className="flex items-center justify-center gap-4 md:bg-gray-300 p-3  dark:bg-darkGreen rounded-full">
                    <UserIcon />
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="hidden items-center justify-center gap-4 md:flex md:bg-gray-300 p-3  dark:bg-darkGreen rounded-full"
                  >
                    <UserIcon />
                    <div>Masuk ke Akun</div>
                  </Link>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {token && (
        <div className="fixed z-50 md:hidden  bottom-0 left-0 right-0 dark:bg-blackHover dark:text-white shadow-xl p-3 px-4">
          <div className="flex  justify-between items-center ">
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
              to="/kontrol"
              className={`flex flex-col items-center justify-center transition-all  ${
                location.pathname === "/kontrol" ? "opacity-100" : "opacity-50"
              }`}
            >
              <Stethoscope />
              <div className="text-sm">Kontrol</div>
            </Link>
            <Link
              to="/obat"
              className={`flex flex-col items-center justify-center transition-all  ${
                location.pathname === "/obat" ? "opacity-100" : "opacity-50"
              }`}
            >
              <ShoppingCart />
              <div className="text-sm">Obat</div>
            </Link>
            <Link
              to="/medis"
              className={`flex flex-col items-center justify-center transition-all  ${
                location.pathname === "/medis" ? "opacity-100" : "opacity-50"
              }`}
            >
              <UserPlus />
              <div className="text-sm">Medis</div>
            </Link>
            <Link
              to="/notifikasi"
              className={`flex flex-col items-center justify-center transition-all  ${
                location.pathname === "/notifikasi"
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
                to="/profile"
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

          {/* Modal Masuk Akun */}
          <Dialog
            header="Masuk ke Akun"
            visible={visibleMasukAkun}
            className="md:w-1/2 w-full "
            onHide={() => {
              if (!visibleMasukAkun) return;
              setVisibleMasukAkun(false);
            }}
          >
            <div className="flex flex-col gap-8">
              <div className="text-xl flex items-center justify-center w-full bg-mainGreen p-4">
                <Link to="/login">Masuk Sebagai Pengguna</Link>
              </div>
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
      )}

      {!token && (
        <div className="fixed z-50 md:hidden  bottom-0 left-0 right-0 dark:bg-blackHover dark:text-white shadow-xl p-3 px-4">
          <div className="flex  justify-evenly items-center ">
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
              to="/login"
              className={`flex flex-col items-center justify-center transition-all  ${
                location.pathname === "/login" ? "opacity-100" : "opacity-50"
              }`}
            >
              <UserIcon />
              <div className="text-sm">Masuk</div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarPengguna;
