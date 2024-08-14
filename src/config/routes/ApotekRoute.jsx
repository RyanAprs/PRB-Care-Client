import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import LoginApotek from "../../pages/apotek/login/LoginApotek";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";
import DashboardApotek from "../../pages/apotek/beranda/BerandaApotek";
import DataPengambilanObat from "../../pages/apotek/dataPengambilanObat/DataPengambilanObat";
import DataObat from "../../pages/apotek/dataObat/DataObat";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import { ProgressSpinner } from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/apotek/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (token && userRole === role) {
    return <Navigate to="/apotek/beranda" />;
  } else if (token && userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const ApotekRoute = () => {
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
            <AlreadyLoggedInRoute role="apoteker">
              <LoginApotek />
            </AlreadyLoggedInRoute>
          }
        />
        <Route
          path="/beranda"
          element={
            <PrivateRoute role="apoteker">
              <NavbarAdmin>
                <DashboardApotek />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-obat"
          element={
            <PrivateRoute role="apoteker">
              <NavbarAdmin>
                <DataObat />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-pengambilan-obat"
          element={
            <PrivateRoute role="apoteker">
              <NavbarAdmin>
                <DataPengambilanObat />
                <Footer />
              </NavbarAdmin>
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/page/not-found" />} />
      </Routes>
    </div>
  );
};

export default ApotekRoute;
