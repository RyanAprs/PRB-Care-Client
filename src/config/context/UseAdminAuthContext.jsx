import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw Error("useAdminAuthContext must be used inside an authContextProvider");
  }

  return context;
};