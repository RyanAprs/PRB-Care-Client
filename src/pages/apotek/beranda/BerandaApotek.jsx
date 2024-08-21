import { useEffect, useRef, useState } from "react";
import { Pill, ShoppingCart } from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { getCurrentAdminApotek } from "../../../services/ApotekService";
import { useModalUpdate } from "../../../config/context/ModalUpdateContext";

const DashboardApotek = () => {
  const [showToast, setShowToast] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const { isUpdated } = useModalUpdate();

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
    const fetchData = async () => {
      try {
        await getCurrentAdminApotek();
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isUpdated]);

  const list = [
    {
      icon: <Pill size={54} strokeWidth={1.5} />,
      title: "Obat",
      desc: "Kelola data obat",
      route: "/apotek/data-obat",
    },
    {
      icon: <ShoppingCart size={54} strokeWidth={1.5} />,
      title: "Ambil Obat",
      desc: "Kelola data ambil obat",
      route: "/apotek/data-pengambilan-obat",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10">
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="rounded-xl shadow-md p-4 flex flex-col items-center justify-center cursor-pointer "
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

export default DashboardApotek;
