import { ShoppingCart, Stethoscope, UserPlus } from "lucide-react";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { getCurrentAdminPuskesmas } from "../../../services/PuskesmasService";

const DashboardPuskesmas = () => {
  const [name, setName] = useState("");

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

  return (
    <div className="flex flex-col p-8  gap-8 ">
      <div className="text-3xl font-semibold">
        Halo, Selamat Datang Kembali {name}!!
      </div>
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

export default DashboardPuskesmas;
