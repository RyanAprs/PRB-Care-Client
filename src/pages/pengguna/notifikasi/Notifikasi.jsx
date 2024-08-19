import { X } from "lucide-react";
import img from "../../../assets/data_empty.png";
const Notifikasi = () => {
  const notifikasiPengambilanObat = JSON.parse(
    localStorage.getItem("notifikasiPengambilanObat")
  );
  const notifikasiKontrolBalik = JSON.parse(
    localStorage.getItem("notifikasiKontrolBalik")
  );

  const notifikasiList = [
    notifikasiPengambilanObat,
    notifikasiKontrolBalik,
  ].filter(Boolean);

  notifikasiList.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className=" md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen">
      <div className="p-8 w-full h-full bg-white dark:bg-blackHover rounded-xl">
        <div className="flex flex-col p-1 gap-4 overflow-y-auto h-full">
          {" "}
          {notifikasiList.length > 0 ? (
            notifikasiList.map((notifikasi, index) => (
              <div
                key={index}
                className="bg-lightGreen dark:bg-mainGreen text-white rounded"
              >
                <div className="flex justify-end p-1 cursor-pointer">
                  <X />
                </div>
                <div className=" p-4  w-full mb-4">
                  <h1 className="text-xl font-semibold mb-2">
                    {notifikasi?.title}
                  </h1>
                  <p className="mb-2">{notifikasi?.body}</p>
                  <p className="text-sm text-white">
                    {new Date(notifikasi?.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex  h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl  ">
            <img src={img} className="md:w-80 w-64" alt="img" />
            Belum Ada Data
            <p className="font-medium text-xl">Data akan muncul di sini ketika tersedia.</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
