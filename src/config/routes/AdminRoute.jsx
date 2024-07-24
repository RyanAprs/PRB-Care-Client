import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginAdmin from "../../pages/admin/login/LoginAdmin";
import { AdminAuthContext } from "../context/AdminAuthContext";
import NotFound from "../../pages/NotFound";
import DashboardAdmin from "../../pages/admin/dashboard/DashboardAdmin";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import DataPuskesmas from "../../pages/admin/dataPuskesmas/DataPuskesmas";
import useDarkMode from "use-dark-mode";
import DataUser from "../../pages/admin/dataUser/DataUser";
import DataPasien from "../../pages/admin/dataPasien/DataPasien";
import DataApotek from "../../pages/admin/dataApotek/DataApotek";
import DataObat from "../../pages/admin/dataObat/DataObat";
import DataKontrolBalik from "../../pages/admin/dataKontrolBalik/DataKontrolBalik";
import DataPengambilanObat from "../../pages/admin/dataPengambilanObat/DataPengambilanObat";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AdminAuthContext);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AdminRoute = () => {
  const { isLoading } = useContext(AdminAuthContext);
  const darkMode = useDarkMode(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DashboardAdmin />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-puskesmas"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataPuskesmas />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-apotek"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataApotek />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-pasien"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataPasien />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-user"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataUser />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-obat"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataObat />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-kontrol-balik"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataKontrolBalik />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/data-pengambilan-obat"
            element={
              <PrivateRoute role="admin">
                <NavbarAdmin>
                  <DataPengambilanObat />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AdminRoute;
