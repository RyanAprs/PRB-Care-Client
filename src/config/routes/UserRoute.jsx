import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../../pages/NotFound";
import { UserAuthContext } from "../context/UserAuthContext";
import LoginUser from "../../pages/user/login/LoginUser";
import RegisterUser from "../../pages/user/register/RegisterUser";
import HomeUser from "../../pages/user/home/HomeUser";
import useDarkMode from "use-dark-mode";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(UserAuthContext);

  if (!token) {
    return <Navigate to="/user/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const UserRoute = () => {
  const darkMode = useDarkMode(false);
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
      <div className={`${darkMode.value ? "dark" : ""}`}>
        <Routes>
          <Route
            path="/user/home"
            element={
              <PrivateRoute role="user">
                <HomeUser />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default UserRoute;
