import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AddressProvider } from "./config/context/AdressContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import { ModalUpdateProvider } from "./config/context/ModalUpdateContext.jsx";
import { HelmetProvider, Helmet } from "react-helmet-async";
const helmetContext = {};

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider context={helmetContext}>
    <PrimeReactProvider
      value={{
        ripple: true,
        pt: {
          button: {
            root: {
              className:
                'outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 box-shadow-none',
            },
          },
          toast:{
            root:{
              className: 'm-0'
            }
          }
        },
      }}
    >
      <main className="font-poppins">
        <AddressProvider>
          <ModalUpdateProvider>
            <Helmet>
              <link
                id="theme-link"
                rel="stylesheet"
                href={new URL('primereact/resources/themes/saga-green/theme.css', import.meta.url).href}
              />
            </Helmet>
            <App />
          </ModalUpdateProvider>
        </AddressProvider>
      </main>
    </PrimeReactProvider>
  </HelmetProvider>
);
