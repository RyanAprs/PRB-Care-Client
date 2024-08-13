import { useEffect, useRef, useState } from "react";
import { Pill, ShoppingCart } from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { getCurrentAdminApotek } from "../../../services/ApotekService";
import { useModalUpdate } from "../../../config/context/ModalUpdateContext";

const DashboardApotek = () => {
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
    const fetchData = async () => {
      try {
        const response = await getCurrentAdminApotek();
        setName(response.namaApotek);
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
      title: "Pengambilan Obat",
      desc: "Kelola data pengambilan obat",
      route: "/apotek/data-pengambilan-obat",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col p-4  gap-4">
      <Toast ref={toast} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="rounded-xl shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer "
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

export default DashboardApotek;
