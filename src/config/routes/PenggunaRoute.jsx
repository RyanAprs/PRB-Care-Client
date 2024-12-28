import {useContext} from "react";
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import {AuthContext} from "../context/AuthContext";
import LoginPengguna from "../../pages/pengguna/login/LoginPengguna";
import RegisterPengguna from "../../pages/pengguna/register/RegisterPengguna";
import HomePengguna from "../../pages/pengguna/home/HomePengguna";
import Home from "../../pages/public/home/Home";
import NavbarPengguna from "../../components/navbar/NavbarPengguna";
import NavbarPublicPage from "../../components/navbar/NavbarPublicPage";
import Kontrol from "../../pages/pengguna/kontrol/Kontrol";
import Obat from "../../pages/pengguna/obat/Obat";
import Notifikasi from "../../pages/pengguna/notifikasi/Notifikasi";
import Medis from "../../pages/pengguna/medis/Medis";
import {ProgressSpinner} from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";
import PublicFooter from "../../components/footer/PublicFooter";
import NoNavbar from "../../components/navbar/NoNavbar";
import DataPuskesmas from "../../pages/public/dataPuskesmas/DataPuskesmas";
import DataApotek from "../../pages/public/dataApotek/DataApotek";
import JadwalProlanis from "../../pages/public/jadwalProlanis/JadwalProlanis";
import Artikel from "../../pages/public/artikel/Artikel";
import DetailArtikel from "../../pages/public/artikel/DetailArtikel";
import KebijakanPrivasi from "../../pages/public/kebijakanPrivasi/KebijakanPrivasi";


const PrivateRoute = ({children, role}) => {
    const {token, role: userRole} = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login"/>;
    }

    if (userRole !== role) {
        return <><NoNavbar/><NotFound/></>;
    }

    return children;
};

const PrivatesRoute = ({ children, role }) => {
    const { token } = useContext(AuthContext);
  
    if (!token) {
      return <><NoNavbar/><NotFound/></>;
    }
  
    return children;
  };

const AlreadyLoggedInRoute = ({children, role}) => {
    const {token, role: userRole} = useContext(AuthContext);
    if (token && userRole === role) {
        return <Navigate to="/beranda"/>;
    }
    return children;
};

const PenggunaRoute = () => {
    const {isLoading} = useContext(AuthContext);

    if (isLoading)
        return (
            <div className="h-screen flex justify-center items-center">
                <NoNavbar/>
                <ProgressSpinner/>
            </div>
        );

    return (
        <Routes>
            <Route
                path="/"
                element={
                <>
                    <NavbarPublicPage />
                    <Home />
                    <PublicFooter />
                </>
                }
            />
            <Route
                path="/data-puskesmas"
                element={
                <>
                    <NavbarPublicPage />
                    <DataPuskesmas />
                    <PublicFooter />
                </>
                }
            />
            <Route
                path="/data-apotek"
                element={
                <>
                    <NavbarPublicPage />
                    <DataApotek />
                    <PublicFooter />
                </>
                }
            />
            <Route
                path="/prolanis"
                element={
                <>
                    <NavbarPublicPage />
                    <JadwalProlanis />
                    <PublicFooter />
                </>
                }
            />
            <Route
                path="/artikel"
                element={
                <>
                    <NavbarPublicPage />
                    <Artikel />
                    <PublicFooter />
                </>
                }
            />
            <Route
                path="/artikel/:id"
                element={
                <>
                    <PrivatesRoute>
                    <NavbarPublicPage />
                    <DetailArtikel />
                    <PublicFooter />
                    </PrivatesRoute>
                </>
                }
            />
            <Route
                path="/kebijakan-privasi"
                element={
                <>
                    <NoNavbar className="absolute right-0 m-2" />
                    <KebijakanPrivasi />
                </>
                }
            />
            <Route
                path="*"
                element={
                <>
                    <NoNavbar />
                    <NotFound />
                </>
                }
            />
            <Route path="/register" element={<><NoNavbar className="absolute right-0 m-2"/><RegisterPengguna/></>}/>
            <Route
                path="/login"
                element={
                    <AlreadyLoggedInRoute role="pengguna">
                        <NoNavbar className="absolute right-0 m-2"/>
                        <LoginPengguna/>
                    </AlreadyLoggedInRoute>
                }
            />
            <Route
                path="/beranda"
                element={
                    <PrivateRoute role="pengguna">
                        <NavbarPengguna/>
                        <HomePengguna/>
                        <Footer/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/kontrol"
                element={
                    <PrivateRoute role="pengguna">
                        <NavbarPengguna/>
                        <Kontrol/>
                        <Footer/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/obat"
                element={
                    <PrivateRoute role="pengguna">
                        <NavbarPengguna/>
                        <Obat/>
                        <Footer/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/medis"
                element={
                    <PrivateRoute role="pengguna">
                        <NavbarPengguna/>
                        <Medis/>
                        <Footer/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/notifikasi"
                element={
                    <PrivateRoute role="pengguna">
                        <NavbarPengguna/>
                        <Notifikasi/>
                        <Footer/>
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<><NoNavbar/><NotFound/></>}/>
        </Routes>
    );
};

export default PenggunaRoute;
