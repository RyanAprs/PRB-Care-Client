import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PenggunaRoute from "./config/routes/PenggunaRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import { AuthContextProvider } from "./config/context/AuthContext";

window.global = window;

function App() {
  return (
    <AuthContextProvider>
      <AdminRoute />
      <PuskesmasRoute />
      <ApotekRoute />
      <PenggunaRoute />
    </AuthContextProvider>
  );
}

export default App;
