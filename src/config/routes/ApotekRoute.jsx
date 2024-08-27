import {useContext} from "react";
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import {AuthContext} from "../context/AuthContext";
import DashboardApotek from "../../pages/apotek/beranda/BerandaApotek";
import DataPengambilanObat from "../../pages/apotek/dataPengambilanObat/DataPengambilanObat";
import DataObat from "../../pages/apotek/dataObat/DataObat";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import {ProgressSpinner} from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";
import NoNavbar from "../../components/navbar/NoNavbar";

const PrivateRoute = ({children, role}) => {
    const {token, role: userRole} = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/apotek/login"/>;
    }

    if (userRole !== role) {
        return <Navigate to="/page/not-found"/>;
    }

    return children;
};

const AlreadyLoggedInRoute = ({children, role}) => {
    const {token, role: userRole} = useContext(AuthContext);
    if (token && userRole === role) {
        return <Navigate to="/admin/beranda"/>;
    }
    return children;
};

const ApotekRoute = () => {
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
                    <Navigate to="/admin/login"/>
                }
            />
            <Route
                path="/beranda"
                element={
                    <PrivateRoute role="apoteker">
                        <NavbarAdmin>
                            <DashboardApotek/>
                            <Footer/>
                        </NavbarAdmin>
                    </PrivateRoute>
                }
            />
            <Route
                path="/data-obat"
                element={
                    <PrivateRoute role="apoteker">
                        <NavbarAdmin>
                            <DataObat/>
                            <Footer/>
                        </NavbarAdmin>
                    </PrivateRoute>
                }
            />
            <Route
                path="/data-pengambilan-obat"
                element={
                    <PrivateRoute role="apoteker">
                        <NavbarAdmin>
                            <DataPengambilanObat/>
                            <Footer/>
                        </NavbarAdmin>
                    </PrivateRoute>
                }
            />
            <Route path="/page/not-found" element={<><NoNavbar/><NotFound/></>}/>
            <Route path="*" element={<><NoNavbar/><NotFound/></>}/>
        </Routes>
    );
};

export default ApotekRoute;
