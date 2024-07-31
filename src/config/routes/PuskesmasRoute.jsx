import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPuskesmas from "../../pages/puskesmas/login/LoginPuskesmas";
import HomePuskesmas from "../../pages/puskesmas/home/HomePuskesmas";
import NotFound from "../../pages/NotFound";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";

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
    return <Navigate to="/puskesmas/home" />;
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
            path="/puskesmas/home"
            element={
              <PrivateRoute role="nakes">
                <HomePuskesmas />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default PuskesmasRoute;
