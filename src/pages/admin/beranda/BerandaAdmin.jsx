import {
  Hospital,
  HousePlus,
  Pill,
  ShoppingCart,
  Stethoscope,
  User2Icon,
  UserPlus,
} from "lucide-react";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const list = [
    {
      icon: <Hospital size={54} />,
      title: "Puskesmas",
      desc: "Kelola data puskesmas",
      route: "/admin/data-puskesmas",
    },
    {
      icon: <HousePlus size={54} />,
      title: "Apotek",
      desc: "Kelola data apotek",
      route: "/admin/data-apotek",
    },
    {
      icon: <UserPlus size={54} />,
      title: "Pasien",
      desc: "Kelola data pasien",
      route: "/admin/data-pasien",
    },
    {
      icon: <User2Icon size={54} />,
      title: "User",
      desc: "Kelola data user",
      route: "/admin/data-user",
    },
    {
      icon: <Pill size={54} />,
      title: "Obat",
      desc: "Kelola data obat",
      route: "/admin/data-obat",
    },
    {
      icon: <Stethoscope size={54} />,
      title: "Kontrol Balik",
      desc: "Kelola data kontrol balik",
      route: "/admin/data-kontrol-balik",
    },
    {
      icon: <ShoppingCart size={54} />,
      title: "Pengambilan Obat",
      desc: "Kelola data pengambilan obat",
      route: "/admin/data-pengambilan-obat",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col p-8 gap-8">
      <div className="text-3xl font-semibold">
        Halo, Selamat Datang Kembali!!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="bg-white rounded text-black shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            onClick={() => handleCardClick(item.route)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xl font-bold mb-2">{item.title}</div>
              {item.icon && <div className="text-4xl mb-2">{item.icon}</div>}
              <div className="text-xl text-center">
                {item.desc}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
