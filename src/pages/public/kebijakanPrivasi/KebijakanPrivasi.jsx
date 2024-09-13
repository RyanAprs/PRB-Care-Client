import img from "../../../assets/prbcare.svg";

const KebijakanPrivasi = () => {
    return (
        <div className="min-h-screen dark:text-white  text-black p-8 md:px-40 text-justify">
            <img src={img} className="mb-2 w-32 mx-auto" alt="img"/>
            <h1 className="text-4xl font-bold mb-6 text-center">Kebijakan Privasi</h1>
            <div className="max-w-3xl mx-auto">
                <p className="mb-4">
                    Terima kasih telah menggunakan PRB Care. Kami menghargai privasi Anda
                    dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan
                    Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                    melindungi data Anda saat Anda menggunakan layanan kami.
                </p>

                <h2 className="text-2xl font-semibold mb-4">
                    1. Informasi yang Kami Kumpulkan
                </h2>
                <p className="mb-4">
                    Kami dapat mengumpulkan informasi berikut dari Anda:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Informasi identitas seperti nama dan nomor telepon.
                    </li>
                    <li>
                        Data kesehatan yang terkait dengan layanan yang kami sediakan.
                    </li>
                    <li>Informasi lain yang diperlukan untuk proses pendaftaran.</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">2. Penggunaan Informasi</h2>
                <p className="mb-4">
                    Kami menggunakan informasi Anda untuk tujuan berikut:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Menyediakan layanan yang Anda minta, termasuk pengingat pengambilan
                        obat dan kunjungan kesehatan.
                    </li>
                    <li>Meningkatkan pengalaman pengguna dan mengoptimalkan aplikasi.</li>
                    <li>Mengirimkan pemberitahuan penting terkait layanan kami.</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">3. Keamanan Data</h2>
                <p className="mb-4">
                    Kami berkomitmen untuk menjaga keamanan informasi pribadi Anda. Kami
                    menggunakan langkah-langkah keamanan teknis dan organisasi untuk
                    melindungi data Anda dari akses yang tidak sah.
                </p>

                <h2 className="text-2xl font-semibold mb-4">4. Berbagi Informasi</h2>
                <p className="mb-4">
                    Kami tidak membagikan informasi pribadi Anda kepada pihak ketiga
                    kecuali jika diperlukan oleh hukum atau dengan persetujuan Anda.
                </p>

                <h2 className="text-2xl font-semibold mb-4">5. Hak Anda</h2>
                <p className="mb-4">
                    Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus data
                    pribadi Anda. Jika Anda ingin mengajukan permintaan terkait data Anda,
                    silakan hubungi kami melalui kontak yang tersedia.
                </p>

                <h2 className="text-2xl font-semibold mb-4">
                    6. Perubahan Kebijakan Privasi
                </h2>
                <p className="mb-4">
                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
                    Perubahan akan diberitahukan melalui aplikasi atau website kami.
                </p>
            </div>
        </div>
    );
};

export default KebijakanPrivasi;
