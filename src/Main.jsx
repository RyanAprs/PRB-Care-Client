import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import useDarkMode from 'use-dark-mode';
import {AddressProvider} from "./config/context/AdressContext.jsx";
import {PrimeReactProvider} from "primereact/api";
import {HelmetProvider, Helmet} from "react-helmet-async";
import {InstallPromptProvider} from "./config/context/InstallPromptContext.jsx";
import {ModalUpdateProvider} from "./config/context/ModalUpdateContext.jsx";

function Main() {
    const helmetContext = {};
    const darkMode = useDarkMode(false, {classNameDark: "dark"});
    return (
        <InstallPromptProvider>
            <HelmetProvider context={helmetContext}>
                <PrimeReactProvider
                    autoZIndex={false}
                    zIndex={{
                        modal: 1100,
                        overlay: 1000,
                        menu: 1000,
                        tooltip: 1100,
                        toast: 2000,
                    }}
                    value={{
                        ripple: true,
                        pt: {
                            button: {
                                root: {
                                    className:
                                        "outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 box-shadow-none",
                                },
                            },
                            toast: {
                                root: {
                                    className: "m-0",
                                },
                            },
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
                                        href={
                                            darkMode.value
                                                ? new URL('primereact/resources/themes/arya-green/theme.css', import.meta.url).href
                                                : new URL('primereact/resources/themes/saga-green/theme.css', import.meta.url).href
                                        }
                                    />
                                </Helmet>
                                <App/>
                            </ModalUpdateProvider>
                        </AddressProvider>
                    </main>
                </PrimeReactProvider>
            </HelmetProvider>
        </InstallPromptProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main/>);
