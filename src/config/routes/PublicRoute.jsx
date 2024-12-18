import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import JadwalProlanis from "../../pages/public/jadwalProlanis/JadwalProlanis";

const PrivateRoute = ({ children, role }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/page/not-found" />;
  }

  return children;
};

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
        path="/prolanis"
        element={
          <>
            <NavbarPublicPage />
            <JadwalProlanis />
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
            <PrivateRoute>
              <NavbarPublicPage />
              <DetailArtikel />
              <PublicFooter />
            </PrivateRoute>
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
