import { useEffect, useRef, useState } from "react";
import {
  Hospital,
  Pill,
  ShoppingCart,
  Stethoscope,
  User2Icon,
  UserPlus,
  HousePlus,
  ScrollText,
  Calendar,
} from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { Ripple } from "primereact/ripple";
import useDarkMode from "use-dark-mode";

const DashboardAdmin = () => {
  const darkMode = useDarkMode(false, { classNameDark: "dark" });
  const navigate = useNavigate();

  const list = [
    {
      icon: <Hospital size={54} strokeWidth={1.2} />,
      title: "Puskesmas",
      desc: "Kelola data puskesmas",
      route: "/admin/data-puskesmas",
    },
    {
      icon: <HousePlus size={54} strokeWidth={1.2} />,
      title: "Apotek",
      desc: "Kelola data apotek",
      route: "/admin/data-apotek",
    },
    {
      icon: <UserPlus size={54} strokeWidth={1.2} />,
      title: "Pasien",
      desc: "Kelola data pasien",
      route: "/admin/data-pasien",
    },
    {
      icon: <User2Icon size={54} strokeWidth={1.2} />,
      title: "Pengguna",
      desc: "Kelola data pengguna",
      route: "/admin/data-pengguna",
    },
    {
      icon: <Pill size={54} strokeWidth={1.2} />,
      title: "Obat",
      desc: "Kelola data obat",
      route: "/admin/data-obat",
    },
    {
      icon: <Stethoscope size={54} strokeWidth={1.2} />,
      title: "Kontrol Balik",
      desc: "Kelola data kontrol balik",
      route: "/admin/data-kontrol-balik",
    },
    {
      icon: <ShoppingCart size={54} strokeWidth={1.2} />,
      title: "Ambil Obat",
      desc: "Kelola data ambil obat",
      route: "/admin/data-pengambilan-obat",
    },
    {
      icon: <Calendar size={54} strokeWidth={1.2} />,
      title: "Jadwal Prolanis",
      desc: "Kelola data jadwal prolanis",
      route: "/admin/data-prolanis",
    },
    {
      icon: <ScrollText size={54} strokeWidth={1.2} />,
      title: "Artikel",
      desc: "Kelola artikel kesehatan",
      route: "/admin/data-artikel",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <div
            onClick={() => handleCardClick(item.route)}
            className=" shadow-md rounded-xl w-full h-full p-ripple"
            key={index}
          >
            <Ripple
              pt={
                darkMode.value
                  ? {
                      root: {
                        style: { background: "rgb(86, 181, 136, 0.3)" },
                      },
                    }
                  : {
                      root: {
                        style: { background: "rgba(64, 145, 108, 0.3)" },
                      },
                    }
              }
            />
            <Card
              key={index}
              className="min-w-10  flex flex-col items-center justify-center cursor-pointer "
              style={{ fontFamily: "Poppins" }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xl font-semibold mb-4">{item.title}</div>
                {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
                <div className="text-xl text-center">{item.desc}</div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
