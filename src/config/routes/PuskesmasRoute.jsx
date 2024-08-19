import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPuskesmas from "../../pages/puskesmas/login/LoginPuskesmas";
import NotFound from "../../pages/NotFound";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";
import DashboardPuskesmas from "../../pages/puskesmas/beranda/BerandaPuskesmas";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import DataPasien from "../../pages/puskesmas/dataPasien/DataPasien";
import DataKontrolBalik from "../../pages/puskesmas/dataKontrolBalik/DataKontrolBalik";
import DataPengambilanObat from "../../pages/puskesmas/dataPengambilanObat/DataPengambilanObat";
import { ProgressSpinner } from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/puskesmas/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (token && userRole === role) {
    return <Navigate to="/puskesmas/beranda" />;
  } 

  return children;
};

const PuskesmasRoute = () => {
  const darkMode = useDarkMode(false);
  const { isLoading } = useContext(AuthContext);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className={`${darkMode.value ? "dark" : ""}`}>
      <Routes>
        <Route
            path="/"
            element={
              <Navigate to="/puskesmas/login" />
            }
          />
        <Route
          path="/login"
          element={
            <AlreadyLoggedInRoute role="nakes">
              <LoginPuskesmas />
            </AlreadyLoggedInRoute>
          }
        />
        <Route
          path="/beranda"
          element={
            <PrivateRoute role="nakes">
              <NavbarAdmin>
                <DashboardPuskesmas />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-pasien"
          element={
            <PrivateRoute role="nakes">
              <NavbarAdmin>
                <DataPasien />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-kontrol-balik"
          element={
            <PrivateRoute role="nakes">
              <NavbarAdmin>
                <DataKontrolBalik />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-pengambilan-obat"
          element={
            <PrivateRoute role="nakes">
              <NavbarAdmin>
                <DataPengambilanObat />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PuskesmasRoute;
