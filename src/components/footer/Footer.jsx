import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 dark:text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4">PRB Care</h2>

          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-400"
            >
              <TwitterIcon />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-pink-500"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Tautan Cepat</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              >
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              >
                Layanan
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              >
                Kontak
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              >
                Kebijakan Privasi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Kontak Kami</h2>
          <p className="text-sm mb-2">
            <strong>Alamat:</strong> Jl. Sehat No. 123, Jakarta, Indonesia
          </p>
          <p className="text-sm mb-2">
            <strong>Email:</strong> support@prbcare.com
          </p>
          <p className="text-sm mb-2">
            <strong>Telepon:</strong> +62 21 1234 5678
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; 2024 PRB Care. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
