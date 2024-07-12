import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginApotek from "../../pages/apotek/login/LoginApotek";

const ApotekRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/apotek/login" element={<LoginApotek />  } />
      </Routes>
    </Router>
  );
};

export default ApotekRoute;
