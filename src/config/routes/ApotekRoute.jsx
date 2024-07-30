import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import LoginApotek from "../../pages/apotek/login/LoginApotek";
import HomeApotek from "../../pages/apotek/home/HomeApotek";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";

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

const ApotekRoute = () => {
  const darkMode = useDarkMode(false);
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/apotek/login" element={<LoginApotek />} />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/apotek/home"
            element={
              <PrivateRoute role="apoteker">
                <HomeApotek />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default ApotekRoute;
