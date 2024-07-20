import {
  AlignLeft,
  BarChart2Icon,
  Hospital,
  HousePlus,
  LogOut,
  User,
  UserRoundPlus,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import icon from "../../assets/PRB-CARE-ICON.png";

const NavbarAdmin = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const location = useLocation();

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

  return (
    <div className="flex h-screen">
      {isSidebarOpen && (
        <div
          ref={overlayRef}
          className={`fixed inset-0 ${
            isSidebarOpen ? "bg-black bg-opacity-50" : "bg-transparent"
          } md:bg-transparent md:bg-opacity-0 z-40`}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={` fixed top-0 left-0 bg-buttonCollor p-4  flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-72"
        } md:relative md:translate-x-0 md:w-72 z-50 gap-8 h-full overflow-y-auto`}
      >
        <div className="flex flex-col text-white h-full gap-8">
          <div className="flex flex-col text-black font-bold text-lg mb-4  items-center justify-center">
            <img src={icon} alt="LOGO PRB CARE" className="w-16 h-16" />
            <h1>PRB CARE</h1>
          </div>
          <div className="flex flex-col h-full justify-around ">
            <div className="flex flex-col h-full gap-2">
              <Link
                to="/admin/dashboard"
                className={`flex px-8 py-4 gap-4 hover:bg-buttonCollor2 ${
                  location.pathname === "/admin/dashboard"
                    ? "bg-buttonCollor2"
                    : ""
                } rounded transition-all`}
              >
                <BarChart2Icon />
                <h1>Dashboard</h1>
              </Link>
              <Link
                to="/admin/data-puskesmas"
                className={`flex px-8 py-4 gap-4 hover:bg-buttonCollor2 ${
                  location.pathname === "/admin/data-puskesmas"
                    ? "bg-buttonCollor2"
                    : ""
                } rounded transition-all`}
              >
                <Hospital />
                <h1>Puskesmas</h1>
              </Link>
              <Link
                to="/admin/apotek"
                className={`flex px-8 py-4 gap-4 hover:bg-buttonCollor2 ${
                  location.pathname === "/admin/data-apotek"
                    ? "bg-buttonCollor2"
                    : ""
                } rounded transition-all`}
              >
                <HousePlus />
                <h1>Apotek</h1>
              </Link>
              <Link
                to="/admin/pasien"
                className={`flex px-8 py-4 gap-4 hover:bg-buttonCollor2 ${
                  location.pathname === "/admin/data-pasien"
                    ? "bg-buttonCollor2"
                    : ""
                } rounded transition-all`}
              >
                <UserRoundPlus />
                <h1>Pasien</h1>
              </Link>
            </div>
            <div>
              <Link
                to=""
                className="flex px-8 py-4 gap-4 hover:bg-buttonCollor2 rounded transition-all"
              >
                <LogOut />
                <h1>Logout</h1>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="h-20 w-full bg-white flex items-center px-8 justify-between fixed md:relative z-46 shadow-xl">
          <div className="flex justify-center items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden block">
              <AlignLeft />
            </button>
            <h1 className="text-black text-xl">
              {location.pathname === "/admin/dashboard" ? "Dashboard" : ""}
              {location.pathname === "/admin/data-puskesmas" ? "Puskesmas" : ""}
              {location.pathname === "/admin/data-apotek" ? "Apotek" : ""}
              {location.pathname === "/admin/data-pasien" ? "Pasien" : ""}
            </h1>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <p>Admin</p>
            <Link to="" className="flex items-center justify-center bg-gray-200 h-10 w-10 rounded-full">
              <User />
            </Link>
          </div>
        </div>
        {/* Content */}
        <div className="flex-grow bg-gray-200 mt-24 md:mt-0 h-full w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
