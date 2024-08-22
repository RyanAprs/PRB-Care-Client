import { useEffect, useState } from "react";
import { Eraser } from "lucide-react";
import img from "../../../assets/data_empty.png";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

const Notifikasi = () => {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [rawNotifikasiList, setRawNotifikasiList] = useState([]); 
  const [sortOrder, setSortOrder] = useState(0);
  const sortOptions = [
    { label: 'Terbaru ke Terlama', value: 1 },
    { label: 'Terlama ke Terbaru', value: 2 }
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
          setRawNotifikasiList(
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

    getNotificationsFromDB();
  }, []); 

  useEffect(() => {
    const sortedNotifications = [...rawNotifikasiList].sort((a, b) => {
      return sortOrder === 1
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });
    setNotifikasiList(sortedNotifications);
  }, [sortOrder, rawNotifikasiList]);

  const deleteNotification = async (id) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction("notifications", "readwrite");
      const objectStore = transaction.objectStore("notifications");
      objectStore.delete(id);

      transaction.oncomplete = () => {
        setRawNotifikasiList((prevList) =>
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
    const element = document.querySelector(`#notifikasi-${id}`);
    if (element) {
      element.classList.add("slide-out");
      setTimeout(() => {
        deleteNotification(id);
      }, 300);
    }
  };

  const listTemplate = (notifikasi) => {
    return (
      <div id={`notifikasi-${notifikasi.id}`} className="py-4 w-full border-b-[1px]">
        <div className="">
          <div className="flex w-full md:flex-row flex-col md:gap-0  gap-4 text-xl px-4 justify-between items-center">
            <div className="flex flex-col items-start justify-center">
              <div className="flex justify-between w-full">
                <div className="flex flex-col">
                  <h1 className="font-poppins font-bold text-start">
                    {notifikasi.title}
                  </h1>
                  <h1 className="text-md md:flex-row flex-col flex justify-center items-center w-fit">
                    {new Date(notifikasi.timestamp).toLocaleString()}
                  </h1>
                </div>
                <Button
                  onClick={() => handleDeleteClick(notifikasi.id)}
                  severity="danger"
                  className="p-2 h-fit rounded-xl "
                  label={<Eraser />}
                />
              </div>
              
              
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
        
        <div className="flex flex-col p-1 gap- overflow-y-auto h-full">
          {notifikasiList.length > 0 ? (
            <>
              <div className="flex md:justify-end justify-center mb-4 gap-2">
                <Dropdown
                  value={sortOrder}
                  options={sortOptions}
                  onChange={(e) => setSortOrder(e.value)}
                  placeholder="Pilih dan Urutan"
                />

              </div>
              <DataView
              value={notifikasiList}
              layout="list"
              itemTemplate={listTemplate}
            />
            </>
            
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
