import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginAdmin from "../../pages/admin/login/LoginAdmin";
import HomeAdmin from "../../pages/admin/home/HomeAdmin";
import { AdminAuthContext } from "../context/AdminAuthContext";
import NotFound from "../../pages/NotFound";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AdminAuthContext);

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

const AdminRoute = () => {
  const { isLoading } = useContext(AdminAuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/admin/home"
          element={
            <PrivateRoute role="admin">
              <HomeAdmin />
            </PrivateRoute>
          }
        />
        <Route path="/page/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AdminRoute;
