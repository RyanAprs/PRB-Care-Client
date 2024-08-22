import { useEffect, useState } from "react";
import { View, X } from "lucide-react";
import img from "../../../assets/data_empty.png";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const Notifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [sortOrder, setSortOrder] = useState(1); // Default to newest first
  const sortOptions = [
    { label: "Terbaru ", value: 1 },
    { label: "Terlama ", value: 2 },
  ];

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

  useEffect(() => {
    const getNotificationsFromDB = async () => {
      try {
        const db = await openIndexedDB();
        const transaction = db.transaction("notifications", "readonly");
        const objectStore = transaction.objectStore("notifications");
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
          const result = event.target.result;
          setNotifikasiList(
            result.map((n) => ({
              ...n.data,
              isRead: n.isRead,
              id: n.id,
            }))
          );
        };

        request.onerror = (event) => {
          console.error("Error fetching notifications:", event.target.error);
        };
      } catch (error) {
        console.error("Failed to open IndexedDB:", error);
      }
    };

    const sortedNotifications = [...notifikasiList].sort((a, b) => {
      return sortOrder === 1
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });
    setNotifikasiList(sortedNotifications);

    getNotificationsFromDB();
  }, [sortOrder, notifikasiList]);

  const deleteNotification = async (id) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction("notifications", "readwrite");
      const objectStore = transaction.objectStore("notifications");
      objectStore.delete(id);

      transaction.oncomplete = () => {
        setNotifikasiList((prevList) =>
          prevList.filter((notifikasi) => notifikasi.id !== id)
        );
      };

      transaction.onerror = (event) => {
        console.error("Error deleting notification:", event.target.error);
      };
    } catch (error) {
      console.error("Failed to open IndexedDB:", error);
    }
  };

  const handleDeleteClick = (id) => {
    // Add animation class before removing notification
    const element = document.querySelector(`#notifikasi-${id}`);
    if (element) {
      element.classList.add("slide-out");
      setTimeout(() => {
        deleteNotification(id);
      }, 300); // Duration of slide-out animation
    }
  };

  const listTemplate = (notifikasi) => {
    return (
      <div
        id={`notifikasi-${notifikasi.id}`}
        className="py-4 w-full border-b-[1px] shadow-lg text-black slide-in"
      >
        <div className="flex w-full md:flex-row flex-col md:gap-0 gap-4 text-xl px-4 justify-between items-start">
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
          <Button
            className="p-2 bg-transparent text-black"
            onClick={() => handleDeleteClick(notifikasi.id)}
          >
            <X size={30} />
          </Button>
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
            onChange={(e) => setSortOrder(e.value)}
            placeholder="Pilih dan Urutan"
          />
          <Button
            label={<View className="md:hidden" />}
            className="p-2 md:px-3 rounded-xl bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen"
          >
            <p className="hidden md:block">Sudah Dibaca</p>
          </Button>
        </div>
        <div className="flex flex-col p-1 gap- overflow-y-auto h-full">
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
