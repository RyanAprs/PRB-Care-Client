import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";

import { ProgressSpinner } from "primereact/progressspinner";
import KebijakanPrivasi from "../../pages/publicPages/kebijakanPrivasi/KebijakanPrivasi";
import Home from "../../pages/publicPages/home/Home";

const PublicRoute = () => {
  const darkMode = useDarkMode(false);
  const { isLoading } = useContext(AuthContext);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className={`${darkMode.value ? "dark" : ""}`}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/kebijakan-privasi"
          element={
            <>
              <KebijakanPrivasi />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default PublicRoute;
