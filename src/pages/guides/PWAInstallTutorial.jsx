const PWAInstallTutorial = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white p-8 md:px-40">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Panduan Instalasi PWA
      </h1>
      <div className="max-w-3xl mx-auto">
        <p className="mb-4">
          Aplikasi PRB Care mendukung instalasi sebagai Aplikasi Web Progresif
          (PWA). Dengan menginstal PRB Care sebagai PWA, Anda dapat mengakses
          aplikasi dengan mudah langsung dari layar beranda perangkat Anda,
          seperti aplikasi lainnya.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Apa itu PWA?</h2>
        <p className="mb-4">
          PWA (Progressive Web App) adalah aplikasi web yang menawarkan
          pengalaman pengguna seperti aplikasi native. Dengan menginstal PWA,
          Anda dapat membuka aplikasi tanpa harus mengakses browser terlebih
          dahulu.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          Cara Menginstal PWA di Android
        </h2>
        <ol className="list-decimal list-inside mb-4">
          <li>
            Buka <b>PRB Care</b> di browser Chrome atau browser lainnya yang
            mendukung PWA.
          </li>
          <li>
            Tekan ikon <b>tiga titik</b> di pojok kanan atas browser.
          </li>
          <li>
            Pilih opsi <b>"Tambahkan ke layar utama"</b>.
          </li>
          <li>
            Konfirmasi dengan menekan <b>"Tambahkan"</b>, dan aplikasi akan
            ditambahkan ke layar beranda Anda.
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">
          Cara Menginstal PWA di iOS
        </h2>
        <ol className="list-decimal list-inside mb-4">
          <li>
            Buka <b>PRB Care</b> di browser Safari.
          </li>
          <li>
            Tekan ikon <b>bagikan</b> di bagian bawah layar (ikon kotak dengan
            panah ke atas).
          </li>
          <li>
            Gulir ke bawah dan pilih opsi <b>"Tambahkan ke Layar Utama"</b>.
          </li>
          <li>
            Tekan <b>"Tambahkan"</b> di pojok kanan atas, dan aplikasi akan
            ditambahkan ke layar beranda Anda.
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">
          Manfaat Menginstal PRB Care sebagai PWA
        </h2>
        <ul className="list-disc list-inside mb-4">
          <li>Akses aplikasi lebih cepat tanpa membuka browser.</li>
          <li>Mendapatkan pengalaman seperti menggunakan aplikasi native.</li>
          <li>Memiliki akses offline ke beberapa fitur.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <p className="mb-4">
          Jika Anda tidak melihat opsi "Tambahkan ke layar utama", pastikan
          browser Anda mendukung PWA dan aplikasi sudah memenuhi kriteria untuk
          diinstal sebagai PWA.
        </p>

        <p className="mb-4">
          Untuk pertanyaan lebih lanjut, silakan hubungi kami di
          prbcare@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default PWAInstallTutorial;
