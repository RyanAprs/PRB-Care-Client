import { useEffect, useRef, useState } from "react";
import {
  Hospital,
  Pill,
  ShoppingCart,
  Stethoscope,
  User2Icon,
  UserPlus,
  HousePlus,
} from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLogin") === "true") {
      setShowToast(true);
      localStorage.removeItem("isLogin");
    }
  }, []);

  useEffect(() => {
    if (showToast) {
      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: "Anda berhasil masuk ke sistem",
        life: 1500,
      });
      setShowToast(false);
    }
  }, [showToast]);

  const list = [
    {
      icon: <Hospital size={54}  strokeWidth={1} />,
      title: "Puskesmas",
      desc: "Kelola data puskesmas",
      route: "/admin/data-puskesmas",
    },
    {
      icon: <HousePlus size={54}  strokeWidth={1} />,
      title: "Apotek",
      desc: "Kelola data apotek",
      route: "/admin/data-apotek",
    },
    {
      icon: <UserPlus size={54}  strokeWidth={1} />,
      title: "Pasien",
      desc: "Kelola data pasien",
      route: "/admin/data-pasien",
    },
    {
      icon: <User2Icon size={54}  strokeWidth={1} />,
      title: "Pengguna",
      desc: "Kelola data pengguna",
      route: "/admin/data-pengguna",
    },
    {
      icon: <Pill size={54}  strokeWidth={1} />,
      title: "Obat",
      desc: "Kelola data obat",
      route: "/admin/data-obat",
    },
    {
      icon: <Stethoscope size={54}  strokeWidth={1} />,
      title: "Kontrol Balik",
      desc: "Kelola data kontrol balik",
      route: "/admin/data-kontrol-balik",
    },
    {
      icon: <ShoppingCart size={54}  strokeWidth={1} />,
      title: "Ambil Obat",
      desc: "Kelola data ambil obat",
      route: "/admin/data-pengambilan-obat",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10">
      <Toast ref={toast} position={window.innerWidth <= 767 ? "top-center":"top-right"} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="min-w-10 rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer "
            style={{ fontFamily: "Poppins, sans-serif", color:"var(--surface-900) !important" }}
            onClick={() => handleCardClick(item.route)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xl font-semibold mb-4">{item.title}</div>
              {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
              <div className="text-xl text-center">{item.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
