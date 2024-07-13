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

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(PuskesmasAuthContext);

  if (!token || userRole !== role) {
    return <Navigate to="/puskesmas/login" />;
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
      </Routes>
    </Router>
  );
};

export default PuskesmasRoute;
