import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "../../pages/admin/login/LoginAdmin";
import NotFound from "../../pages/NotFound";
import DashboardAdmin from "../../pages/admin/beranda/BerandaAdmin";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import DataPuskesmas from "../../pages/admin/dataPuskesmas/DataPuskesmas";
import useDarkMode from "use-dark-mode";
import DataPasien from "../../pages/admin/dataPasien/DataPasien";
import DataApotek from "../../pages/admin/dataApotek/DataApotek";
import DataObat from "../../pages/admin/dataObat/DataObat";
import DataKontrolBalik from "../../pages/admin/dataKontrolBalik/DataKontrolBalik";
import DataPengambilanObat from "../../pages/admin/dataPengambilanObat/DataPengambilanObat";
import { AuthContext } from "../context/AuthContext";
import DataPengguna from "../../pages/admin/dataPengguna/DataPengguna";
import { ProgressSpinner } from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (token && userRole === role) {
    return <Navigate to="/admin/beranda" />;
  } else if (token && userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AdminRoute = () => {
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
          path="/login"
          element={
            <AlreadyLoggedInRoute role="admin">
              <LoginAdmin />
            </AlreadyLoggedInRoute>
          }
        />
        <Route
          path="/beranda"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DashboardAdmin />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-puskesmas"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DataPuskesmas />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-apotek"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DataApotek />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-pasien"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DataPasien />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-pengguna"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DataPengguna />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-obat"
          element={
            <PrivateRoute role="admin">
              <NavbarAdmin>
                <DataObat />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-kontrol-balik"
          element={
            <PrivateRoute role="admin">
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
            <PrivateRoute role="admin">
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

export default AdminRoute;
