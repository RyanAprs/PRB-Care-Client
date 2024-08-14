import { useContext } from "react";
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
import { ProgressSpinner } from "primereact/progressspinner";
import Footer from "../../components/footer/Footer";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AlreadyLoggedInRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (token && userRole === role) {
    return <Navigate to="/" />;
  } else if (token && userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const PenggunaRoute = () => {
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
        <Route path="/register" element={<RegisterPengguna />} />
        <Route
          path="/login"
          element={
            <AlreadyLoggedInRoute role="pengguna">
              <LoginPengguna />
            </AlreadyLoggedInRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
        <Route
          path="/"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <HomePengguna />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/kontrol"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <Kontrol />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/obat"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <Obat />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <Profile />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/medis"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <Medis />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifikasi"
          element={
            <PrivateRoute role="pengguna">
              <NavbarPengguna />
              <Notifikasi />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PenggunaRoute;
