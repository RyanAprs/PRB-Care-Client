import { Card, CardBody } from "@nextui-org/react";
import { Hospital, HousePlus, UserPlus } from "lucide-react";

const DashboardAdmin = () => {
  const list = [
    {
      icon: <Hospital size={54} color="black" />,
      total: 10,
      title: "Puskesmas",
    },
    {
      icon: <HousePlus size={54} color="black" />,
      total: 43,
      title: "Apotek",
    },
    {
      icon: <UserPlus size={54} color="black" />,
      total: 157,
      title: "Pasien",
    },
  ];

  return (
    <div className="flex flex-col p-8 gap-8">
      <div className="text-3xl">
        Halo, Selamat Datang Kembali!!
      </div>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        {list.map((item, index) => (
          <Card shadow="sm" key={index} isPressable>
            <CardBody className=" overflow-visible p-16">
              <div className="flex gap-8 justify-center items-center">
                <div>{item.icon}</div>
                <div>
                  <div className="text-3xl text-buttonCollor">{item.total}</div>
                  <div>{item.title}</div>
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
