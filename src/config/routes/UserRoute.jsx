import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginUser from "../../pages/user/login/LoginUser";
import RegisterUser from "../../pages/user/register/RegisterUser";

const UserRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<RegisterUser />} />
        <Route path="/user/login" element={<LoginUser />} />
      </Routes>
    </Router>
  );
};

export default UserRoute;
