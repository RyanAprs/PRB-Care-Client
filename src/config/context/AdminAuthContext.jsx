import { createContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

export const AdminAuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      Cookies.set(
        "auth",
        JSON.stringify({ token: action.payload, role: "admin" })
      );
      return { token: action.payload, role: "admin", isLoading: false };
    case "LOGOUT":
      Cookies.remove("auth");
      return { token: null, role: null, isLoading: false };
    default:
      return state;
  }
};

export const AdminAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const authCookie = Cookies.get("auth");

    if (authCookie) {
      const { token, role } = JSON.parse(authCookie);
      dispatch({ type: "LOGIN", payload: token });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, dispatch }}>
      {state.isLoading ? <div>Loading...</div> : children}
    </AdminAuthContext.Provider>
  );
};
