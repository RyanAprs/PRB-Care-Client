import {ShoppingCart, Stethoscope, UserPlus,ScrollText} from "lucide-react";
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";
import {Ripple} from 'primereact/ripple';
import useDarkMode from 'use-dark-mode';

const DashboardPuskesmas = () => {
    const darkMode = useDarkMode(false, {classNameDark: "dark"});

    const navigate = useNavigate();


    const list = [
        {
            icon: <UserPlus size={54} strokeWidth={1.2}/>,
            title: "Pasien",
            desc: "Kelola data pasien",
            route: "/puskesmas/data-pasien",
        },
        {
            icon: <Stethoscope size={54} strokeWidth={1.2}/>,
            title: "Kontrol Balik",
            desc: "Kelola data kontrol balik",
            route: "/puskesmas/data-kontrol-balik",
        },
        {
            icon: <ShoppingCart size={54} strokeWidth={1.2}/>,
            title: "Ambil Obat",
            desc: "Kelola data ambil obat",
            route: "/puskesmas/data-pengambilan-obat",
        },
        {
            icon: <ScrollText size={54} strokeWidth={1.2}/>,
            title: "Artikel",
            desc: "Kelola artikel kesehatan",
            route: "/puskesmas/data-artikel",
        },
    ];

    const handleCardClick = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4 z-10">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {list.map((item, index) => (
                    <div onClick={() => handleCardClick(item.route)}
                         className="  shadow-md rounded-xl w-full h-full p-ripple">
                        <Ripple
                            pt={
                                darkMode.value
                                    ? {
                                        root: {
                                            style: { background: "rgb(86, 181, 136, 0.3)" },
                                        }
                                    }
                                    : {
                                        root: {
                                            style: { background: "rgba(64, 145, 108, 0.3)" },
                                        },
                                    }
                            }
                        />
                        <Card
                            key={index}
                            className="min-w-10  flex flex-col items-center justify-center cursor-pointer "
                            style={{fontFamily: "Poppins"}}

                        >
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="text-xl font-semibold mb-4">{item.title}</div>
                                {item.icon && <div className="text-4xl mb-4">{item.icon}</div>}
                                <div className="text-xl text-center">{item.desc}</div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPuskesmas;
