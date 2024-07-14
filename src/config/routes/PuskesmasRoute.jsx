import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPuskesmas from "../../pages/puskesmas/login/LoginPuskesmas";
import HomePuskesmas from "../../pages/puskesmas/home/HomePuskesmas";
import { PuskesmasAuthContext } from "../context/PuskesmasAuthContext";
import NotFound from "../../pages/NotFound";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(PuskesmasAuthContext);

  if (!token) {
    return <Navigate to="/puskesmas/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const PuskesmasRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/puskesmas/login" element={<LoginPuskesmas />} />
        <Route
          path="/puskesmas/home"
          element={
            <PrivateRoute role="nakes">
              <HomePuskesmas />
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default PuskesmasRoute;
