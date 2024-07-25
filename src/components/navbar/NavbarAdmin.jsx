import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlignLeft,
  BarChart4Icon,
  Hospital,
  HousePlus,
  LogOut,
  Pill,
  ShoppingCart,
  Stethoscope,
  User,
  UserRoundPlus,
} from "lucide-react";
import icon from "../../assets/prbcare.svg";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Cookies from "js-cookie";

const NavbarAdmin = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onOpenChange: onProfileOpenChange,
  } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      overlayRef.current &&
      !overlayRef.current.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/admin/login");
  };

  const Sidebar = () => (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 dark:bg-darkGreen bg-mainGreen text-white p-4 flex-col transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-96"
      }  md:translate-x-0 md:w-80 overflow-y-auto z-50 gap-8 h-full border-1 border-gray-300 dark:border-blackHover`}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex flex-col border-b border-lightGreen font-bold text-lg mb-4 items-center justify-center">
          <img src={icon} alt="LOGO PRB CARE" className="w-auto h-20" />
          <h1>PRB CARE</h1>
        </div>
        <div className="flex flex-col h-full justify-around">
          <div className="flex flex-col h-full gap-2">
            <Link
              to="/admin/dashboard"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/dashboard"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <BarChart4Icon />
              <h1>Dashboard</h1>
            </Link>
            <Link
              to="/admin/data-puskesmas"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-puskesmas"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <Hospital />
              <h1>Puskesmas</h1>
            </Link>
            <Link
              to="/admin/data-apotek"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-apotek"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <HousePlus />
              <h1>Apotek</h1>
            </Link>
            <Link
              to="/admin/data-user"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-user"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <User />
              <h1>User</h1>
            </Link>
            <Link
              to="/admin/data-pasien"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-pasien"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <UserRoundPlus />
              <h1>Pasien</h1>
            </Link>
            <Link
              to="/admin/data-obat"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-obat"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <Pill />
              <h1>Obat</h1>
            </Link>
            <Link
              to="/admin/data-kontrol-balik"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-kontrol-balik"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <Stethoscope />
              <h1>Kontrol Balik</h1>
            </Link>
            <Link
              to="/admin/data-pengambilan-obat"
              className={`flex px-8 py-4 gap-4 hover:bg-lightGreen dark:hover:bg-mainGreen ${
                location.pathname === "/admin/data-pengambilan-obat"
                  ? "bg-lightGreen dark:bg-mainGreen"
                  : ""
              } rounded transition-all`}
            >
              <ShoppingCart />
              <h1>Pengambilan Obat</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full">
      {isSidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 md:bg-transparent md:bg-opacity-0"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="h-20 w-full flex items-center px-8 justify-between fixed  z-40 shadow-md dark:shadow-blackHover dark:bg-darkGreen bg-mainGreen text-white">
          <div className="flex justify-center items-center gap-4 md:pl-80 pl-0">
            <button onClick={toggleSidebar} className="md:hidden block">
              <AlignLeft />
            </button>
            <h1 className="text-xl md:block hidden">
              {location.pathname === "/admin/dashboard" ? "Dashboard" : ""}
              {location.pathname === "/admin/data-puskesmas"
                ? "Data Puskesmas"
                : ""}
              {location.pathname === "/admin/data-apotek" ? "Data Apotek" : ""}
              {location.pathname === "/admin/data-pasien" ? "Data Pasien" : ""}
              {location.pathname === "/admin/data-user" ? "Data User" : ""}
              {location.pathname === "/admin/data-obat" ? "Data Obat" : ""}
              {location.pathname === "/admin/data-kontrol-balik"
                ? "Data Kontrol Balik"
                : ""}
              {location.pathname === "/admin/data-pengambilan-obat"
                ? "Data Pengambilan Obat"
                : ""}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <ThemeSwitcher />
            </div>
            <div className="flex gap-4 justify-center items-center">
              <p className="md:block hidden">Admin</p>
              <div
                to=""
                onClick={onProfileOpen}
                className="flex items-center justify-center bg-gray-200 h-10 w-10 rounded-full cursor-pointer"
              >
                <User className="text-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-gray-200 dark:bg-black dark:text-white h-auto md:pl-80    pt-20 overflow-y-scroll w-full overflow-x-auto">
          {children}
        </div>
      </div>

      {/* Modal Profile */}
      <Modal
        isOpen={isProfileOpen}
        onOpenChange={onProfileOpenChange}
        className="w-52 p-3  mt-20  mr-6"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 20,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
              placeContent: "end",
              placeItems: "start",
            },
            exit: {
              y: 1,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <div className="flex flex-col justify-between">
            <div className="text-md hover:bg-gray-300 transition-all rounded-xl p-2 cursor-pointer">
              Profile
            </div>
            <div
              onClick={onOpen}
              className="text-md hover:bg-gray-300 transition-all rounded-xl p-2 cursor-pointer"
            >
              Logout
            </div>
          </div>
        </ModalContent>
      </Modal>

      {/* Modal Logout */}
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg">Logout</span>
              </ModalHeader>
              <div className="flex flex-col gap-4 p-6">
                <p className="text-md">
                  Are you sure you want to logout from the application?
                </p>
              </div>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    handleLogout();
                    onClose();
                  }}
                >
                  Logout
                </Button>
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NavbarAdmin;
