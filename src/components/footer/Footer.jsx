import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 dark:text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">PRB Care</h2>

          <div className="flex space-x-4 mt-4">
            <Link
              to=""
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <FacebookIcon />
            </Link>
            <Link
              to=""
              className="text-gray-600 dark:text-gray-300 hover:text-blue-400"
            >
              <TwitterIcon />
            </Link>
            <Link
              to=""
              className="text-gray-600 dark:text-gray-300 hover:text-pink-500"
            >
              <InstagramIcon />
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4">Tautan Cepat</h2>
          <Link
            to=""
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            Tentang Kami
          </Link>

          <Link
            to=""
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            Layanan
          </Link>

          <Link
            to=""
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            Kontak
          </Link>

          <Link
            to=""
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            Kebijakan Privasi
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Kontak Kami</h2>

          <p className="text-sm mb-2">
            <strong>Email:</strong> prbcare@gmail.com
          </p>
        </div>
      </div>
      <div className="border-t flex flex-col gap-4 border-gray-200 dark:border-gray-700 mt-8 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <h1>&copy; 2024 PRB Care. All rights reserved.</h1>
        <p className="text-sm">
          <strong>Develop by Hilmi Raif Avicenna & Ryan Adi Prasetyo.</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
