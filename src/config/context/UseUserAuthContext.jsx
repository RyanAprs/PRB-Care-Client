import { useContext } from "react";
import { UserAuthContext } from "./UserAuthContext";

export const useUserAuthContext = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw Error(
      "useUserAuthContext must be used inside an authContextProvider"
    );
  }

  return context;
};
