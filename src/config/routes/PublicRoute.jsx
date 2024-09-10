import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import { AuthContext } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import KebijakanPrivasi from "../../pages/public/kebijakanPrivasi/KebijakanPrivasi";
import NavbarPublicPage from "../../components/navbar/NavbarPublicPage";
import NoNavbar from "../../components/navbar/NoNavbar";
import PublicFooter from "../../components/footer/PublicFooter";
import Home from "../../pages/public/home/Home";
import DataPuskesmas from "../../pages/public/dataPuskesmas/DataPuskesmas";
import DataApotek from "../../pages/public/dataApotek/DataApotek";
import Artikel from "../../pages/public/artikel/Artikel";
import DetailArtikel from "../../pages/public/artikel/DetailArtikel";

const PublicRoute = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <NoNavbar />
        <ProgressSpinner />
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
        path="/artikel"
        element={
          <>
            <NavbarPublicPage />
            <Artikel />
            <PublicFooter />
          </>
        }
      />
      <Route
        path="/artikel/:id"
        element={
          <>
            <NavbarPublicPage />
            <DetailArtikel />
            <PublicFooter />
          </>
        }
      />
      <Route
        path="/kebijakan-privasi"
        element={
          <>
            <NoNavbar className="absolute right-0 m-2" />
            <KebijakanPrivasi />
          </>
        }
      />
      <Route
        path="*"
        element={
          <>
            <NoNavbar />
            <NotFound />
          </>
        }
      />
    </Routes>
  );
};

export default PublicRoute;
