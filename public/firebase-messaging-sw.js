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

const DB_NAME = "fcm_notifications";
let db;

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("notifications", {
        keyPath: "id",
        autoIncrement: true,
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

async function storeNotificationData(data) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["notifications"], "readwrite");
  const objectStore = transaction.objectStore("notifications");

  const request = objectStore.add({ data });

  request.onsuccess = () => console.log(`Notification stored in IndexedDB`);
  request.onerror = (event) =>
    console.error("Error storing notification:", event.target.error);
}

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload.data);

  const {
    title,
    namaLengkap,
    namaApotek,
    namaPuskesmas,
    tanggalPengambilan,
    tanggalKontrol,
    tanggalBatal,
  } = payload.data;

  let tanggalAmbilLocal, tanggalBatalLocal;
  let notificationTitle, notificationBody;

  if (namaApotek) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalPengambilan)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, jadwal pengambilan obat anda di apotek ${namaApotek} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationData);
  } else if (namaPuskesmas) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalKontrol)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, jadwal kontrol balik anda  di puskesmas ${namaPuskesmas} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationData);
  }

  const notificationOptions = {
    body: notificationBody,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

function convertUnixTimestampToLocalTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const localDate = date.toLocaleString("id-ID", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  return localDate;
}
