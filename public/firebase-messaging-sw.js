importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// hardcode config :v ganti konfigurasi firebase ini dengan milik proyek kamu sendiri
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
      const objectStore = db.createObjectStore("notifications", {
        keyPath: "id",
        autoIncrement: true,
      });
      objectStore.createIndex("isRead", "isRead", { unique: false });
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

  const notificationData = { data, isRead: false };

  const request = objectStore.add(notificationData);

  request.onerror = (event) =>
    console.error("Error storing notification:", event.target.error);
}

messaging.onBackgroundMessage((payload) => {
  const {
    namaLengkap,
    namaApotek,
    namaPuskesmas,
    tanggalPengambilan,
    tanggalKontrol,
    tanggalBatal,
    tanggalMulai,
    tanggalSelesai,
  } = payload.data;

  let tanggalAmbilLocal,
    tanggalBatalLocal,
    tanggalMulaiLocal,
    tanggalSelesaiLocal;
  let notificationTitle, notificationBody;

  if (namaApotek) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalPengambilan)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = "PRBCare - Ambil Obat";
    notificationBody = `${namaLengkap}, jadwal pengambilan obat anda di apotek ${namaApotek} mulai ${tanggalAmbilLocal} hingga ${tanggalBatalLocal}. Pastikan datang pada jam operasional.`;

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationData);
  } else if (namaPuskesmas && tanggalMulai && tanggalSelesai) {
    tanggalMulaiLocal = convertUnixToHumanHour(parseInt(tanggalMulai));
    tanggalSelesaiLocal = convertUnixToHumanHour(parseInt(tanggalSelesai));
    notificationTitle = "PRBCare - Prolanis";
    notificationBody = `Terdapat jadwal Prolanis pada ${tanggalMulaiLocal} sampai ${tanggalSelesaiLocal} di ${namaPuskesmas}. Silahkan hadir jika berkenan.`;
    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationData);
  } else if (namaPuskesmas && tanggalKontrol) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalKontrol)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = "PRBCare - Kontrol Balik";
    notificationBody = `${namaLengkap}, anda memiliki jadwal kontrol di puskesmas ${namaPuskesmas} pada ${tanggalAmbilLocal}. Pastikan datang pada jam operasional.`;

    const notificationData = {
      title: notificationTitle,
      body: notificationBody,
      timestamp: Date.now(),
    };
    storeNotificationData(notificationData);
  }

  const notificationOptions = {
    body: notificationBody,
    icon: "/assets/prbcare.png",
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
function  convertUnixToHumanHour(unixTimestamp){
  const date = new Date(unixTimestamp * 1000);

  return date.toLocaleTimeString("id-ID", {
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};