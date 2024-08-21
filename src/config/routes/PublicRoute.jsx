import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import useDarkMode from "use-dark-mode";
import { AuthContext } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import KebijakanPrivasi from "../../pages/publicPages/kebijakanPrivasi/KebijakanPrivasi";
import NavbarPublicPage from "../../components/navbar/NavbarPublicPage";
import PublicFooter from "../../components/footer/PublicFooter";
import Home from "../../pages/publicPages/home/Home";
import DataPuskesmas from "../../pages/publicPages/dataPuskesmas/DataPuskesmas";
import DataApotek from "../../pages/publicPages/dataApotek/DataApotek";

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
              <NavbarPublicPage />
              <Home />
              <PublicFooter />
            </>
          }
        />
        <Route
          path="/data-puskesmas"
          element={
            <>
              <NavbarPublicPage />
              <DataPuskesmas />
              <PublicFooter />
            </>
          }
        />
        <Route
          path="/data-apotek"
          element={
            <>
              <NavbarPublicPage />
              <DataApotek />
              <PublicFooter />
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
