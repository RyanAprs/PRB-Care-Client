import Cookies from "js-cookie";
import { Mail,FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";
import img from "../../assets/prbcare.svg";
const Footer = () => {
  const role = Cookies.get("role");
  return (  role !== "pengguna" ? 
<footer className="bg-white dark:bg-blackHover dark:text-white">
  <div className="flex md:justify-end justify-center gap-4 border-gray-200 dark:border-gray-700 mt-8 py-2 pr-2 text-sm">
    <h1>
      &copy; {new Date().getFullYear()} PRB Care, Made with ❤ by <a href="https://github.com/RyanAprs">Ryan</a>. 
    </h1>
  </div>
</footer>
   : 
   <footer className="bg-darkGrays text-white pt-12  pb-24 md:pb-4">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col mx-auto items-center">

          <div className="flex items-center">
            <img src={img} alt="img" width={50} />
            <h2 className="text-2xl font-bold text-center ml-1">PRB Care</h2>
          </div>
          

          <div className="flex space-x-4 mt-4">
            <Link
              to=""
              className=" hover:text-blue-700"
            >
              <FacebookIcon />
            </Link>
            <Link
              to=""
              className=" hover:text-blue-400"
            >
              <TwitterIcon />
            </Link>
            <Link
              to=""
              className=" hover:text-pink-500"
            >
              <InstagramIcon />
            </Link>
          </div>
        </div>

        <div className="flex flex-col mx-auto items-center md:items-start ">
          <h2 className="text-xl font-bold mb-4  text-center">Tautan Cepat</h2>
          <Link
            to=""
          >
            Beranda
          </Link>
          <Link
            to=""
          >
            Kontrol Balik
          </Link>
          <Link
            to=""
          >
            Pengambilan Obat
          </Link>
          <Link
            to=""
          >
            Rekam Medis
          </Link>
          <Link
            to=""
          >
            Pemberitahuan
          </Link>
        </div>

        <div className="mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Kontak Kami</h2>

          <p className="text-sm mb-2 flex">
            <Mail/> <h1 className="ml-2">prbcare@gmail.com</h1>
          </p>
        </div>
      </div>

      <div className="border-t-2 flex flex-col border-dashed gap-4 border-white mt-12 pt-6 text-center text-sm">
        <h1>
      &copy; {new Date().getFullYear()} PRB Care, Made with ❤ by <a href="https://github.com/RyanAprs">Ryan</a>. 
    </h1>
      </div>
      </footer>
);
};

export default Footer;
