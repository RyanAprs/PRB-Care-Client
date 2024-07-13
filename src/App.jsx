import React from "react";
import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import UserRoute from "./config/routes/UserRoute";
import { AdminAuthContextProvider } from "./config/context/AdminAuthContext";

function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center font-poppins">
      <AdminAuthContextProvider>
        <AdminRoute />
      </AdminAuthContextProvider>
      <PuskesmasRoute />
      <ApotekRoute />
      <UserRoute />
    </div>
  );
}

export default App;
