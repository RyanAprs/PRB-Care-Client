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

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useContext(AdminAuthContext);

  if (!token || userRole !== role) {
    return <Navigate to="/admin/login" />;
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
      </Routes>
    </Router>
  );
};

export default AdminRoute;
