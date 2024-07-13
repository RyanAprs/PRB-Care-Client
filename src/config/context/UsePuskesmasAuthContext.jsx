import { useContext } from "react";
import { PuskesmasAuthContext } from "./PuskesmasAuthContext";

export const usePuskesmasAuthContext = () => {
  const context = useContext(PuskesmasAuthContext);

  if (!context) {
    throw Error(
      "usePuskesmasAuthContext must be used inside an authContextProvider"
    );
  }

  return context;
};
