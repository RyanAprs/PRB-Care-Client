import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import { AuthContext } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import KebijakanPrivasi from "../../pages/publicPages/kebijakanPrivasi/KebijakanPrivasi";
import NavbarPublicPage from "../../components/navbar/NavbarPublicPage";
import NoNavbar from "../../components/navbar/NoNavbar";
import PublicFooter from "../../components/footer/PublicFooter";
import Home from "../../pages/publicPages/home/Home";
import DataPuskesmas from "../../pages/publicPages/dataPuskesmas/DataPuskesmas";
import DataApotek from "../../pages/publicPages/dataApotek/DataApotek";

const PublicRoute = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <NoNavbar/><ProgressSpinner />
      </div>
    );

  return (
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
              <NoNavbar/><KebijakanPrivasi/>
            </>
          }
        />
        <Route path="*" element={<><NoNavbar /><NotFound /></>} />
      </Routes>
  );
};

export default PublicRoute;
