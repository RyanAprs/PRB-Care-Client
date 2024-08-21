import { ShoppingCart, Stethoscope, UserPlus } from "lucide-react";
import { Card } from "primereact/card";
import { useEffect, useRef, useState } from "react";
import { getCurrentAdminPuskesmas } from "../../../services/PuskesmasService";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useModalUpdate } from "../../../config/context/ModalUpdateContext";

const DashboardPuskesmas = () => {
  const [name, setName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { isUpdated, setIsUpdated } = useModalUpdate();

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

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getCurrentAdminPuskesmas();
        setName(response.namaPuskesmas);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [isUpdated]);
  const list = [
    {
      icon: <UserPlus size={54} strokeWidth={1.5} />,
      title: "Pasien",
      desc: "Kelola data pasien",
      route: "/puskesmas/data-pasien",
    },
    {
      icon: <Stethoscope size={54} strokeWidth={1.5} />,
      title: "Kontrol Balik",
      desc: "Kelola data kontrol balik",
      route: "/puskesmas/data-kontrol-balik",
    },
    {
      icon: <ShoppingCart size={54} strokeWidth={1.5} />,
      title: "Ambil Obat",
      desc: "Kelola data ambil obat",
      route: "/puskesmas/data-pengambilan-obat",
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
            className="rounded-xl p-4 shadow-md flex flex-col items-center justify-center cursor-pointer"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "var(--surface-900) !important",
            }}
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

export default DashboardPuskesmas;
