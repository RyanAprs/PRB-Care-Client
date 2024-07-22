import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AddressProvider } from "./config/context/AdressContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <AddressProvider>
      <main className="font-poppins">
        <App />
      </main>
    </AddressProvider>
  </NextUIProvider>
);
