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
import ReCAPTCHA from "react-google-recaptcha";
import useDarkMode from 'use-dark-mode';
import { Skeleton } from "primereact/skeleton";

const VITE_RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY;

const LoginForm = ({ title, API_URI, navigateUser, role }) => {
  const darkMode = useDarkMode(false, { classNameDark: "dark" });
  const recaptchaRef = useRef(null);
  const [recaptchaKey, setRecaptchaKey] = useState(0);
  const [isCaptchaLoading, setCaptchaLoading] = useState(true);

  useEffect(() => {
    setRecaptchaKey((prevKey) => prevKey + 1);
    if (recaptchaRef.current) {
      setCaptchaLoading(true);
      recaptchaRef.current.reset();
    }

    const timer = setTimeout(() => {
      setCaptchaLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [darkMode.value]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenRecaptcha, setTokenRecaptcha] = useState("");
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
  const uriPuskesmas = `${
      import.meta.env.VITE_API_BASE_URI
  }/api/admin-puskesmas/login`;
  const uriApotek = `${
      import.meta.env.VITE_API_BASE_URI
  }/api/admin-apotek/login`;

  const [selectedRole, setSelectedRole] = useState("");
  const roles = [
    { name: "Admin Super", value: "admin" },
    { name: "Admin Puskesmas", value: "puskesmas" },
    { name: "Admin Apotek", value: "apotek" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      loginUser && loginSchema.parse({ username, password, tokenRecaptcha });
      loginAdmin &&
      loginAdminSchema.parse({ username, password, selectedRole, tokenRecaptcha });

      const response = await axios.post(
          selectedRole === "admin"
              ? uriAdmin
              : selectedRole === "puskesmas"
                  ? uriPuskesmas
                  : selectedRole === "apotek"
                      ? uriApotek
                      : API_URI,
          { username, password, tokenRecaptcha },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      if (response.status === 200) {
        dispatch({
          type: "LOGIN",
          payload: { token: response.data.token, role: role },
        });
        localStorage.setItem("isLogin", "true");
        navigate(
            selectedRole === "admin"
                ? navigateAdmin
                : selectedRole === "puskesmas"
                    ? navigatePuskesmas
                    : selectedRole === "apotek"
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
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setTokenRecaptcha("");
        handleLoginError(error, toast);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen w-full flex justify-center items-center md:p-8">
        <Toast
            ref={toast}
            position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="flex justify-center items-center w-full md:w-1/2 flex-col gap-6">
          <div className="flex justify-center items-center flex-col w-full">
            <img className="h-auto w-48 mb-2" src={icon} alt="PRB CARE Logo" />
            <h1 className="text-3xl font-semibold">Masuk {title}</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <label htmlFor="" className="-mb-3">
              Username:
            </label>
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
            <label htmlFor="" className="-mb-3">
              Password:
            </label>
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
                  <label htmlFor="" className="-mb-3">
                    Role:
                  </label>
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

            {isCaptchaLoading && <Skeleton width="301px" height="75px" />}

            <div className={`${isCaptchaLoading ? "hidden" : "block"}`}>
              <ReCAPTCHA
                  key={recaptchaKey}
                  theme={darkMode.value ? "dark" : "light"}
                  className="rounded-lg md:mx-0 mx-auto w-fit "
                  ref={recaptchaRef}
                  sitekey={`${VITE_RECAPTCHA_KEY}`}
                  onChange={(value) => setTokenRecaptcha(value ? value : "")}
              />
            </div>

            {errors.tokenRecaptcha && (
                <span className="text-red-500 p-error -mt-3 text-sm mx-auto w-fit">
              {errors.tokenRecaptcha}
            </span>
            )}

            <div className="flex flex-col w-full gap-4">
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
              {loginUser && (
                  <div className="flex w-full gap-1 items-center justify-center">
                    Belum punya akun?
                    <Link
                        to="/pengguna/register"
                        className="text-mainGreen font-semibold"
                    >
                      daftar
                    </Link>
                  </div>
              )}
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;
