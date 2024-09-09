import {Mail, FacebookIcon, InstagramIcon, TwitterIcon} from "lucide-react";
import {Link} from "react-router-dom";
import img from "../../assets/prbcare.svg";

const PublicFooter = () => {
    return (
        <footer className="bg-white dark:bg-blackHover dark:text-white pt-10  md:pb-1">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col mx-auto items-center">
                    <div className="flex items-center">
                        <img src={img} alt="img" width={50}/>
                        <h2 className="text-2xl font-bold text-center ml-1">PRBCare</h2>
                    </div>

                    <div className="flex space-x-4 mt-4">
                        <Link to="" className=" ">
                            <FacebookIcon/>
                        </Link>
                        <Link to="" className=" ">
                            <TwitterIcon/>
                        </Link>
                        <Link to="" className=" ">
                            <InstagramIcon/>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col mx-auto items-center md:items-start pt-2">
                    <h2 className="text-xl font-bold mb-4  text-center">Tautan Cepat</h2>
                    <Link
                        className=""
                        to="/"
                    >
                        Beranda
                    </Link>
                    <Link
                        className=""
                        to="/data-puskesmas"
                    >
                        Puskesmas Terdaftar
                    </Link>
                    <Link
                        className=""
                        to="/data-apotek"
                    >
                        Apotek Terdaftar
                    </Link>
                    <Link
                        className=""
                        to="/kebijakan-privasi"
                    >
                        Kebijakan Privasi
                    </Link>
                </div>

                <div className="mx-auto pt-2">
                    <h2 className="text-xl font-bold mb-4 text-center ">Kontak Kami</h2>

                    <p className="text-sm mb-2 ">
                        <Link to="mailto:prbcare@gmail.com" className={`flex`}>
                            <Mail/> <h1 className="ml-2">prbcare@gmail.com</h1>
                        </Link>
                    </p>
                </div>
            </div>

            <div
                className="mx-4 border-t-[1px] flex flex-col  gap-4  border-black dark:border-white mt-12 pt-1 pb-[68px] md:pb-0 text-center text-sm">
                <h1 className="flex gap-1 items-center justify-center">
                     &copy; {new Date().getFullYear()} PRBCare. All rights reserved.
                </h1>
            </div>
        </footer>
    );
};

export default PublicFooter;
