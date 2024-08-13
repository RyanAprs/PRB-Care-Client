import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./config/routes/AdminRoute"; // Assuming these are protected routes
import ApotekRoute from "./config/routes/ApotekRoute";
import PenggunaRoute from "./config/routes/PenggunaRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import { AuthContextProvider } from "./config/context/AuthContext";
import NotFound from "./pages/NotFound";

window.global = window;

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<PenggunaRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/puskesmas/*" element={<PuskesmasRoute />} />
          <Route path="/apotek/*" element={<ApotekRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
