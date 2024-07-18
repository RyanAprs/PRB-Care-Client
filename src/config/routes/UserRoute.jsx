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
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
        <Route
          path="/user/home"
          element={
            <PrivateRoute role="user">
              <HomeUser />
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default UserRoute;
