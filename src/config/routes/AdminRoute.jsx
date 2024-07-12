import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAdmin from "../../pages/admin/login/LoginAdmin";

const AdminRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
};

export default AdminRoute;
