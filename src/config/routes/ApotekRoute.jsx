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
import ProfileApotek from "../../pages/apotek/profileApotek/ProfileApotek";

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/apotek/login"
          element={
            <AlreadyLoggedInRoute role="apoteker">
              <LoginApotek />
            </AlreadyLoggedInRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/apotek/beranda"
            element={
              <PrivateRoute role="apoteker">
                <NavbarAdmin>
                  <DashboardApotek />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/apotek/data-obat"
            element={
              <PrivateRoute role="apoteker">
                <NavbarAdmin>
                  <DataObat />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/apotek/data-pengambilan-obat"
            element={
              <PrivateRoute role="apoteker">
                <NavbarAdmin>
                  <DataPengambilanObat />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
          <Route
            path="/apotek/profile"
            element={
              <PrivateRoute role="apoteker">
                <NavbarAdmin>
                  <ProfileApotek />
                </NavbarAdmin>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default ApotekRoute;
