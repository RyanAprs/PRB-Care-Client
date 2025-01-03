import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "../../pages/admin/login/LoginAdmin";
import NotFound from "../../pages/NotFound";
import DashboardAdmin from "../../pages/admin/beranda/BerandaAdmin";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import DataPuskesmas from "../../pages/admin/dataPuskesmas/DataPuskesmas";
import DataPasien from "../../pages/admin/dataPasien/DataPasien";
import DataApotek from "../../pages/admin/dataApotek/DataApotek";
import DataObat from "../../pages/admin/dataObat/DataObat";
import DataKontrolBalik from "../../pages/admin/dataKontrolBalik/DataKontrolBalik";
import DataPengambilanObat from "../../pages/admin/dataPengambilanObat/DataPengambilanObat";
import { AuthContext } from "../context/AuthContext";
import DataPengguna from "../../pages/admin/dataPengguna/DataPengguna";
import { ProgressSpinner } from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";
import NoNavbar from "../../components/navbar/NoNavbar";
import DataArtikel from "../../pages/admin/dataArtikel/DataArtikel";
import DataJadwalProlanis from "../../pages/admin/dataJadwalProlanis/DataJadwalProlanis";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (userRole !== role) {
    return <><NoNavbar/><NotFound/></>;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);
  if (token && userRole === "admin") {
    return <Navigate to="/admin/beranda" />;
  } else if (token && userRole === "nakes") {
    return <Navigate to="/puskesmas/beranda" />;
  } else if (token && userRole === "apoteker") {
    return <Navigate to="/apotek/beranda" />;
  }
  return children;
};

const AdminRoute = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <NoNavbar />
        <ProgressSpinner />
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" />} />
      <Route
        path="/login"
        element={
          <AlreadyLoggedInRoute role="admin">
            <NoNavbar className="absolute right-0 m-2" />
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
      <Route
        path="/data-artikel"
        element={
          <PrivateRoute role="admin">
            <NavbarAdmin>
              <DataArtikel />
              <Footer />
            </NavbarAdmin>
          </PrivateRoute>
        }
      />
      <Route
        path="/data-prolanis"
        element={
          <PrivateRoute role="admin">
            <NavbarAdmin>
              <DataJadwalProlanis />
              <Footer />
            </NavbarAdmin>
          </PrivateRoute>
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
    </Routes>
  );
};

export default AdminRoute;
