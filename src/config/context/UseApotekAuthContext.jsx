import { useContext } from "react";
import { ApotekAuthContext } from "./ApotekAuthContext";

export const useApotekAuthContext = () => {
  const context = useContext(ApotekAuthContext);

  if (!context) {
    throw Error(
      "useApotekAuthContext must be used inside an authContextProvider"
    );
  }

  return context;
};
