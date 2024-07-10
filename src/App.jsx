import AdminRoute from "./config/routes/AdminRoute";
import ApotekRoute from "./config/routes/ApotekRoute";
import PuskesmasRoute from "./config/routes/PuskesmasRoute";
import UserRoute from "./config/routes/UserRoute";

function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <AdminRoute />
      <PuskesmasRoute />
      <ApotekRoute />
      <UserRoute />
    </div>
  );
}

export default App;
