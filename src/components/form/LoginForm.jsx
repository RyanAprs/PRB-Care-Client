import { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import icon from "../../assets/prbcare.svg";
import { AuthContext } from "../../config/context/AuthContext";
import { ZodError } from "zod";
import { Toast } from "primereact/toast";
import { handleLoginError } from "../../utils/ApiErrorHandlers";
import { loginAdminSchema, loginSchema } from "../../validations/LoginSchema";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Turnstile } from "@marsidev/react-turnstile";
import useDarkMode from 'use-dark-mode';

const VITE_TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_KEY;

const LoginForm = ({ title, API_URI, navigateUser, role }) => {
  const ref = useRef();
  const darkMode = useDarkMode(false, { classNameDark: "dark" });
  const turnstileLight = {
    theme: 'light',
    language: 'id',
  };
  const turnstileDark = {
    theme: 'dark',
    language: 'id',
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenCaptcha, setTokenCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loginUser = location.pathname === "/pengguna/login";
  const loginAdmin = location.pathname === "/admin/login";

  const navigateAdmin = "/admin/beranda";
  const navigatePuskesmas = "/puskesmas/beranda";
  const navigateApotek = "/apotek/beranda";

  const uriAdmin = `${import.meta.env.VITE_API_BASE_URI}/api/admin-super/login`;
  const uriPuskesmas = `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas/login`;
  const uriApotek = `${import.meta.env.VITE_API_BASE_URI}/api/admin-apotek/login`;

  const [selectedRole, setSelectedRole] = useState(localStorage.getItem("selectedRole") || "");
  const roles = [
    { name: "Admin Super", value: "admin" },
    { name: "Admin Puskesmas", value: "puskesmas" },
    { name: "Admin Apotek", value: "apotek" },
  ];

  useEffect(() => {
    setTokenCaptcha("");
    ref.current?.reset();
  }, [darkMode.value]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      loginUser && loginSchema.parse({ username, password, tokenCaptcha });
      loginAdmin && loginAdminSchema.parse({ username, password, selectedRole, tokenCaptcha });

      const response = await axios.post(
          loginAdmin && selectedRole === "admin"
              ? uriAdmin
              : loginAdmin && selectedRole === "puskesmas"
                  ? uriPuskesmas
                  : loginAdmin && selectedRole === "apotek"
                      ? uriApotek
                      : API_URI,
          { username, password, tokenCaptcha },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        if (loginAdmin) {
          localStorage.setItem("selectedRole", selectedRole);
        }

        dispatch({
          type: "LOGIN",
          payload: { token: response.data.token, role: role },
        });
        localStorage.setItem("isLogin", "true");
        navigate(
            loginAdmin && selectedRole === "admin"
                ? navigateAdmin
                : loginAdmin && selectedRole === "puskesmas"
                    ? navigatePuskesmas
                    : loginAdmin && selectedRole === "apotek"
                        ? navigateApotek
                        : navigateUser
        );
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        setTokenCaptcha("");
        ref.current?.reset();
        handleLoginError(error, toast);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen w-full flex justify-center items-center md:p-8 py-8">
        <Toast
            ref={toast}
            position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="flex justify-center items-center w-full md:w-1/2 flex-col gap-4">
          <div className="flex justify-center items-center flex-col w-full">
            <img className="h-auto w-48 mb-2" src={icon} alt="PRB CARE Logo" />
            <h1 className="text-3xl font-semibold">Masuk {title}</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <label htmlFor="" className="-mb-3">Username:</label>
            <InputText
                type="text"
                placeholder="Username"
                className="p-input text-lg p-4 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
                <small className="p-error text-red-500 text-sm -mt-3">
                  {errors.username}
                </small>
            )}

            <label htmlFor="" className="-mb-3">Password:</label>
            <InputText
                type="password"
                placeholder="Password"
                className="p-input text-lg p-4 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
                <small className="p-error text-red-500 text-sm -mt-3">
                  {errors.password}
                </small>
            )}

            {loginAdmin && (
                <>
                  <label htmlFor="" className="-mb-3">Role:</label>
                  <Dropdown
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.value)}
                      options={roles}
                      optionLabel="name"
                      placeholder="Pilih Role"
                      className="p-input text-lg p-2 rounded"
                  />
                  {errors.selectedRole && (
                      <small className="p-error text-red-500 text-sm -mt-3">
                        {errors.selectedRole}
                      </small>
                  )}
                </>
            )}

            <Turnstile
                ref={ref}
                siteKey={VITE_TURNSTILE_KEY}
                className="md:mx-0 mx-auto"
                options={darkMode.value ? turnstileDark : turnstileLight}
                onSuccess={(token) => setTokenCaptcha(token)}
                onError={() => {
                  setTokenCaptcha("");
                  ref.current?.reset();
                }}
                onExpire={() => {
                  setTokenCaptcha("");
                  ref.current?.reset();
                }}
            />

            {errors.tokenCaptcha && (
                <span className="text-red-500 p-error -mt-3 text-sm md:mx-0 mx-auto w-fit">
              {errors.tokenCaptcha}
            </span>
            )}

            <div className="flex flex-col w-full gap-3">
              <Button
                  className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
                  type="submit"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <ProgressSpinner
                        style={{ width: "24px", height: "24px" }}
                        strokeWidth="8"
                        animationDuration="1s"
                        color="white"
                    />
                ) : (
                    <p>Masuk</p>
                )}
              </Button>
              <div className="flex flex-col gap-1">
                <div className="flex w-full gap-1 items-center justify-center">
                  Lupa passsword?
                  <Link to="mailto:prbcare@gmail.com" className="text-mainGreen font-semibold">
                    kontak kami
                  </Link>
                </div>
                {loginUser && (
                    <div className="flex w-full gap-1 items-center justify-center">
                      Belum punya akun?
                      <Link to="/pengguna/register" className="text-mainGreen font-semibold">
                        daftar
                      </Link>
                    </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;
