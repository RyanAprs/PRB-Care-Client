import { ShoppingCart, Stethoscope, UserPlus } from "lucide-react";
import { Card } from "primereact/card";
import { useEffect, useRef, useState } from "react";
import { getCurrentAdminPuskesmas } from "../../../services/PuskesmasService";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const DashboardPuskesmas = () => {
  const [name, setName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

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
  });
  const list = [
    {
      icon: <UserPlus size={54} />,
      title: "Pasien",
      desc: "Kelola data pasien",
    },
    {
      icon: <Stethoscope size={54} />,
      title: "Kontrol Balik",
      desc: "Kelola data kontrol balik",
    },
    {
      icon: <ShoppingCart size={54} />,
      title: "Pengambilan Obat",
      desc: "Kelola data pengambilan obat",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col p-8  gap-8 ">
      <Toast ref={toast} />
      <div className="text-3xl font-semibold">
        Halo, Selamat Datang Kembali {name}!!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-blackHover dark:text-white rounded text-black shadow-lg p-4 flex flex-col items-center justify-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
            onClick={() => handleCardClick(item.route)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xl font-bold mb-2">{item.title}</div>
              {item.icon && <div className="text-4xl mb-2">{item.icon}</div>}
              <div className="text-xl text-center">{item.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPuskesmas;
