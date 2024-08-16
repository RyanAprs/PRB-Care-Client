// firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD3Ev4h06VRpvizQAsmI0G8VIiaVjNxnw",
  authDomain: "prb-care-v1-70a29.firebaseapp.com",
  projectId: "prb-care-v1-70a29",
  storageBucket: "prb-care-v1-70a29.appspot.com",
  messagingSenderId: "665778315877",
  appId: "1:665778315877:web:0271e8ba4b02529d951c8c",
  measurementId: "G-122Y1K7VRS",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Function to convert Unix timestamp (seconds) to local time
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

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

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

  if (namaApotek) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalPengambilan)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, anda memiliki jadwal pengambilan obat pada tanggal ${tanggalAmbilLocal} pada apotek ${namaApotek} dan akan dibatalkan otomatis pada tanggal ${tanggalBatalLocal}`;
  } else if (namaPuskesmas) {
    tanggalAmbilLocal = convertUnixTimestampToLocalTime(
      parseInt(tanggalKontrol)
    );
    tanggalBatalLocal = convertUnixTimestampToLocalTime(parseInt(tanggalBatal));
    notificationTitle = title;
    notificationBody = `${namaLengkap}, anda memiliki jadwal kontrol balik pada tanggal ${tanggalAmbilLocal} di puskesmas ${namaPuskesmas} dan akan dibatalkan otomatis pada tanggal ${tanggalBatalLocal}`;
  }

  const notificationOptions = {
    body: notificationBody,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
