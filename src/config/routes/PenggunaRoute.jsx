import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";
import LoginPengguna from "../../pages/pengguna/login/LoginPengguna";
import RegisterPengguna from "../../pages/pengguna/register/RegisterPengguna";
import HomePengguna from "../../pages/pengguna/home/HomePengguna";
import NavbarPengguna from "../../components/navbar/NavbarPengguna";
import Kontrol from "../../pages/pengguna/kontrol/Kontrol";
import Obat from "../../pages/pengguna/obat/Obat";
import Profile from "../../pages/pengguna/profile/Profile";
import Notifikasi from "../../pages/pengguna/notifikasi/Notifikasi";
import Medis from "../../pages/pengguna/medis/Medis";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/pengguna/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (token && userRole === role) {
    return <Navigate to="/pengguna/home" />;
  } else if (token && userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const PenggunaRoute = () => {
  const darkMode = useDarkMode(false);
  return (
    <Router>
      <Routes>
        <Route path="/pengguna/register" element={<RegisterPengguna />} />
        <Route
          path="/pengguna/login"
          element={
            <AlreadyLoggedInRoute role="pengguna">
              <LoginPengguna />
            </AlreadyLoggedInRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/pengguna/home"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <HomePengguna />
              </PrivateRoute>
            }
          />

          <Route
            path="/pengguna/kontrol"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <Kontrol />
              </PrivateRoute>
            }
          />

          <Route
            path="/pengguna/obat"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <Obat />
              </PrivateRoute>
            }
          />
          <Route
            path="/pengguna/profile"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/pengguna/medis"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <Medis />
              </PrivateRoute>
            }
          />
          <Route
            path="/pengguna/notifikasi"
            element={
              <PrivateRoute role="pengguna">
                <NavbarPengguna />
                <Notifikasi />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default PenggunaRoute;
