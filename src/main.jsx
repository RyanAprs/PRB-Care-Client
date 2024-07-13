import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AddressProvider } from "./config/context/AdressContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <AddressProvider>
        <App />
      </AddressProvider>
    </NextUIProvider>
  </React.StrictMode>
);
