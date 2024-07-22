import { Card, CardBody } from "@nextui-org/react";
import {
  Hospital,
  HousePlus,
  Pill,
  ShoppingCart,
  Stethoscope,
  User2Icon,
  UserPlus,
} from "lucide-react";

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
    <div className="flex flex-col p-8 gap-8 ">
      <div className="text-3xl">Halo, Selamat Datang Kembali!!</div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 ">
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            className="bg-white dark:bg-blackHover"
          >
            <CardBody className=" overflow-visible p-10">
              <div className="flex flex-col gap-4 justify-center items-center">
                <div className="text-xl font-semibold">{item.title}</div>
                <div>
                  <div>{item.desc}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
