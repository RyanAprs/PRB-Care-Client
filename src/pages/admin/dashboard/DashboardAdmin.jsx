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

const DashboardAdmin = () => {
  const list = [
    {
      icon: <Hospital size={54} />,
      title: "Puskesmas",
      desc: "Kelola data puskesmas",
    },
    {
      icon: <HousePlus size={54} />,
      title: "Apotek",
      desc: "Kelola data apotek",
    },
    {
      icon: <UserPlus size={54} />,
      title: "Pasien",
      desc: "Kelola data pasien",
    },
    {
      icon: <User2Icon size={54} />,
      title: "User",
      desc: "Kelola data user",
    },
    {
      icon: <Pill size={54} />,
      title: "Obat",
      desc: "Kelola data obat",
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

  return (
    <div className="flex flex-col p-8  gap-8 ">
      <div className="text-3xl">Halo, Selamat Datang Kembali!!</div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 ">
        {list.map((item, index) => (
          <Card
            title={item.title}
            key={index}
            className="bg-mainGreen rounded dark:bg-darkGreen text-white shadow-lg"
          >
            <div className="py-2 overflow-visible">
              <div className="text-xl flex items-center justify-center">
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
