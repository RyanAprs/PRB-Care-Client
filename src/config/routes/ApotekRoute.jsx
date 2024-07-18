import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import { ApotekAuthContext } from "../context/ApotekAuthContext";
import LoginApotek from "../../pages/apotek/login/LoginApotek";
import HomeApotek from "../../pages/apotek/home/HomeApotek";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(ApotekAuthContext);

  if (!token) {
    return <Navigate to="/apotek/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const ApotekRoute = () => {
  const { isLoading } = useContext(ApotekAuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/apotek/login" element={<LoginApotek />} />
        <Route
          path="/apotek/home"
          element={
            <PrivateRoute role="apoteker">
              <HomeApotek />
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default ApotekRoute;
