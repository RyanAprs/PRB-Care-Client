import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/prbcare.svg";
import { HomeIcon, Hospital, HousePlus } from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AuthContext } from "../../config/context/AuthContext";

const NavbarPublicPage = () => {
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const roles = [
    { name: "Pengguna", value: "pengguna" },
    { name: "Admin", value: "admin" },
  ];

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleNavigate = () => {
    if (selectedRole === "admin") {
      navigate("/admin/login");
    } else if (selectedRole === "pengguna") {
      navigate("/pengguna/login");
    }
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
          <div className="relative flex gap-2 md:gap-2 items-center justify-center">
            <ThemeSwitcher />
          </div>
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
            {!token && (
              <div
                onClick={handleOpenModal}
                className="mx-auto transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                Masuk
              </div>
            )}
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
        </div>
      </div>

      <Dialog
        header="Masuk Sebagai:"
        visible={visible}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col gap-8 justify-center">
          <div className="flex flex-col gap-4 ">
            <Dropdown
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.value)}
              options={roles}
              optionLabel="name"
              placeholder="Pilih Role"
              className="p-input text-lg p-2 rounded"
            />
            <Button
              label="Lanjutkan"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              autoFocus
              onClick={handleNavigate}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NavbarPublicPage;
