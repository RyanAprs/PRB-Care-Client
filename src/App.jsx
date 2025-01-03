import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PenggunaRoute from "./config/routes/PenggunaRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import { AuthContextProvider } from "./config/context/AuthContext";
import NotFound from "./pages/NotFound";
import { NotificationProvider } from "./config/context/NotificationContext.jsx";
import {InstallPromptProvider} from "./config/context/InstallPromptContext.jsx";
import ScrollToTop from './components/scrollToTop/ScrollToTop.jsx';
import {NotificationSetupProvider} from "@/config/context/NotificationSetupContext.jsx";

window.global = window;

function App() {
  return (
      <InstallPromptProvider>
        <AuthContextProvider>
          <NotificationProvider>
            <NotificationSetupProvider>
            <Router>
              <ScrollToTop>
                <Routes>
                  <Route path="/*" element={<PenggunaRoute />} />
                  <Route path="/admin/*" element={<AdminRoute />} />
                  <Route path="/puskesmas/*" element={<PuskesmasRoute />} />
                  <Route path="/apotek/*" element={<ApotekRoute />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ScrollToTop>
            </Router>
            </NotificationSetupProvider>
          </NotificationProvider>
        </AuthContextProvider>
        </InstallPromptProvider>
  );
}

export default App;
