import { useEffect, useState } from "react";
import img from "../../../assets/data_empty.png";
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import {
  View
} from "lucide-react";
const Notifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [sortOrder, setSortOrder] = useState(-1); 
  const sortOptions = [
    { label: 'Terbaru ke Terlama', value: 1 },
    { label: 'Terlama ke Terbaru', value: 2 }
  ];

  useEffect(() => {
    const openIndexedDB = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("fcm_notifications", 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("notifications")) {
            db.createObjectStore("notifications", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    };

    const getNotificationsFromDB = async () => {
      try {
        const db = await openIndexedDB();
        const transaction = db.transaction("notifications", "readonly");
        const objectStore = transaction.objectStore("notifications");
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          const result = event.target.result;
          const sortedNotifications = result.sort(
            (a, b) => b.data.timestamp - a.data.timestamp
          );
          setNotifikasiList(sortedNotifications.map((n) => n.data));
        };

        request.onerror = (event) => {
          console.error("Error fetching notifications:", event.target.error);
        };
      } catch (error) {
        console.error("Failed to open IndexedDB:", error);
      }
    };

    getNotificationsFromDB();
  }, []);

  const handleSortChange = (e) => {
    const order = e.value;
    const sortedNotifications = [...notifikasiList].sort((a, b) => {
      return order === 1
        ? b.timestamp - a.timestamp 
        : a.timestamp - b.timestamp; 
    });
    setNotifikasiList(sortedNotifications);
    setSortOrder(order);
  };

  const listTemplate = (notifikasi) => {
    return (
      <div className="py-4 w-full border-b-[1px]">
        <div className="">
          <div className="flex w-full md:flex-row flex-col md:gap-0  gap-4 text-xl px-4 justify-between items-center">
            <div className="flex flex-col items-start justify-center">
              <div className="flex">
                <h1 className="font-poppins font-bold text-start">
                  {notifikasi.title}
                </h1>
              </div>
              <h1 className="text-md md:flex-row flex-col flex justify-center items-center">
                {new Date(notifikasi.timestamp).toLocaleString()}
              </h1>
              <h1 className="font-poppins md:text-start text-justify mt-4">
                {notifikasi.body}
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays min-h-screen">
      <div className="p-8 w-full min-h-screen bg-white dark:bg-blackHover rounded-xl">
        <div className="flex md:justify-end justify-center mb-4 gap-2">
        <Dropdown
            value={sortOrder}
            options={sortOptions}
            onChange={handleSortChange}
            placeholder="Pilih dan Urutan"
          />
          <Button label={<View className="md:hidden" />} className="p-2 md:px-3 rounded-xl bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen" >
          <p className="hidden md:block">Sudah Dibaca</p>
          </Button>
        </div>
        <div className="flex flex-col p-1 gap-4 overflow-y-auto h-full">
          {notifikasiList.length > 0 ? (
            <DataView
              value={notifikasiList}
              layout="list"
              itemTemplate={listTemplate}
            />
          ) : (
            <div className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
              <img src={img} className="md:w-80 w-64" alt="img" />
              Belum Ada Data
              <p className="font-medium text-xl">
                Data akan muncul di sini ketika tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
