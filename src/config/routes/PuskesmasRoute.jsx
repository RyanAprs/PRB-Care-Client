import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPuskesmas from "../../pages/puskesmas/login/LoginPuskesmas";

const PuskesmasRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/puskesmas/login" element={<LoginPuskesmas />} />
      </Routes>
    </Router>
  );
};

export default PuskesmasRoute;
