import { Pill, ShoppingCart } from "lucide-react";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { getCurrentAdminApotek } from "../../../services/ApotekService";

const DashboardApotek = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getCurrentAdminApotek();
        setName(response.namaApotek);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  });
  const list = [
    {
      icon: <Pill size={54} />,
      title: "Obat",
      desc: "Kelola data obat",
    },
    {
      icon: <ShoppingCart size={54} />,
      title: "Pengambilan Obat",
      desc: "Kelola data pengambilan obat",
    },
  ];

  return (
    <div className="flex flex-col p-8 gap-8">
      <div className="text-3xl font-semibold">
        Halo, Selamat Datang Kembali {name}!!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.map((item, index) => (
          <Card
            key={index}
            className="bg-white rounded text-black shadow-lg p-4 flex flex-col items-center justify-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
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

export default DashboardApotek;
