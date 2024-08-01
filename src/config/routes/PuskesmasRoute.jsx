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
import DashboardPuskesmas from "../../pages/puskesmas/dashboard/DashboardPuskesmas";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import DataApotek from "../../pages/puskesmas/dataApotek/DataApotek";
import DataPasien from "../../pages/puskesmas/dataPasien/DataPasien";
import DataKontrolBalik from "../../pages/puskesmas/dataKontrolBalik/DataKontrolBalik";
import DataPengembalianObat from "../../pages/puskesmas/dataPengembalianObat/DataPengembalianObat";
import ProfilePuskesmas from "../../pages/puskesmas/profilePuskesmas/ProfilePuskesmas";

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
    return <Navigate to="/puskesmas/dashboard" />;
  } else if (token && userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const PuskesmasRoute = () => {
  const darkMode = useDarkMode(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/puskesmas/login"
          element={
            <AlreadyLoggedInRoute role="nakes">
              <LoginPuskesmas />
            </AlreadyLoggedInRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/puskesmas/dashboard"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <DashboardPuskesmas />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/puskesmas/profile"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <ProfilePuskesmas />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/puskesmas/data-apotek"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <DataApotek />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/puskesmas/data-pasien"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <DataPasien />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/puskesmas/data-kontrol-balik"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <DataKontrolBalik />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/puskesmas/data-pengambilan-obat"
            element={
              <PrivateRoute role="nakes">
                <NavbarAdmin>
                  <DataPengembalianObat />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default PuskesmasRoute;
