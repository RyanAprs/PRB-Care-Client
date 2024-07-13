import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginAdmin from "../../pages/admin/login/LoginAdmin";
import HomeAdmin from "../../pages/admin/home/HomeAdmin";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminRoute = () => {
  const { token, role, isLoading } = useContext(AdminAuthContext);

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
            token && role === "admin" ? (
              <HomeAdmin />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AdminRoute;
