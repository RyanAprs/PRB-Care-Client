import React from 'react'
import { Link } from 'react-router-dom'

const SideBarAdmin = () => {
  return (
    {/* Sidebar */}
      <div
        // ref={sidebarRef}
        className={`fixed top-0 left-0 dark:bg-darkGreen bg-mainGreen text-white p-4 flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-96"
        } md:relative md:translate-x-0 md:w-96 w-3/4 z-50 gap-8 h-full overflow-y-auto border-1 border-gray-300 dark:border-blackHover`}
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
  )
}

export default SideBarAdmin