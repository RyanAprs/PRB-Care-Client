importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCD3Ev4h06VRpvizQAsmI0G8VIiaVjNxnw",
  authDomain: "prb-care-v1-70a29.firebaseapp.com",
  projectId: "prb-care-v1-70a29",
  storageBucket: "prb-care-v1-70a29.appspot.com",
  messagingSenderId: "665778315877",
  appId: "1:665778315877:web:0271e8ba4b02529d951c8c",
  measurementId: "G-122Y1K7VRS",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// IndexedDB setup
const DB_NAME = "fcm_notifications";
let db;

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1); // Version 1

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("notifications", {
        keyPath: "type", // Use notification type as the key
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };
  });
}

async function storeNotificationData(type, data) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["notifications"], "readwrite");
  const objectStore = transaction.objectStore("notifications");
  const request = objectStore.put({ type, data });

  request.onsuccess = () => console.log(`${type} stored in IndexedDB`);
  request.onerror = (event) =>
    console.error("Error storing notification:", event.target.error);
}

async function getStoredNotification(type) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["notifications"], "readonly");
  const objectStore = transaction.objectStore("notifications");
  const request = objectStore.get(type);

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload.data);

  // Extract data
  const {
    title,
    namaLengkap,
    namaApotek,
    namaPuskesmas,
    tanggalPengambilan,
    tanggalKontrol,
    tanggalBatal,
  } = payload.data;

  // Convert timestamps to local time
  let tanggalAmbilLocal, tanggalBatalLocal;
  let notificationTitle, notificationBody;
  let notificationType;

  if (namaApotek) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalPengambilan)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, anda memiliki jadwal pengambilan obat pada tanggal ${tanggalAmbilLocal} pada apotek ${namaApotek} dan akan dibatalkan otomatis pada tanggal ${tanggalBatalLocal}`;
    notificationType = "notifikasiPengambilanObat";

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationType, notificationData);
  } else if (namaPuskesmas) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalKontrol)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, anda memiliki jadwal kontrol balik pada tanggal ${tanggalAmbilLocal} di puskesmas ${namaPuskesmas} dan akan dibatalkan otomatis pada tanggal ${tanggalBatalLocal}`;
    notificationType = "notifikasiKontrolBalik";

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationType, notificationData);
  }

  const notificationOptions = {
    body: notificationBody,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

function convertUnixTimestampToLocalTime(timestamp) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const localDate = date.toLocaleString("id-ID", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  return localDate;
}
