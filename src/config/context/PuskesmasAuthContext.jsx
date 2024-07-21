import { createContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";

export const PuskesmasAuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { token, role } = action.payload;
      Cookies.set("token", token);
      Cookies.set("role", role);
      return { token, role, isLoading: false };
    case "LOGOUT":
      Cookies.remove("token");
      Cookies.remove("role");
      return { token: null, role: null, isLoading: false };
    default:
      return state;
  }
};

export const PuskesmasAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      dispatch({ type: "LOGIN", payload: { token, role } });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <PuskesmasAuthContext.Provider value={{ ...state, dispatch }}>
      {state.isLoading ? <div>Loading...</div> : children}
    </PuskesmasAuthContext.Provider>
  );
};
