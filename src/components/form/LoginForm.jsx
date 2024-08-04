import { useContext, useRef, useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import icon from "../../assets/prbcare.svg";
import { AuthContext } from "../../config/context/AuthContext";
import { ZodError } from "zod";
import { Toast } from "primereact/toast";
import { handleLoginError } from "../../utils/ApiErrorHandlers";
import { loginSchema } from "../../validations/LoginSchema";

const LoginForm = ({ title, API_URI, navigateUser, role }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const toast = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      loginSchema.parse({ username, password });
      const response = await axios.post(
        API_URI,
        { username, password },
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
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        handleLoginError(error, toast);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <Toast ref={toast} />
      <div className="flex justify-center items-center w-full md:w-1/2 flex-col gap-6">
        <div className="flex justify-center items-center flex-col w-full">
          <img className="h-auto w-48" src={icon} alt="PRB CARE Logo" />
          <h1 className="text-3xl font-bold">Masuk {title}</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <InputText
            type="text"
            placeholder="Username"
            className="p-input text-lg p-4 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <small className="p-error text-sm -mt-3">{errors.username}</small>
          )}
          <InputText
            type="password"
            placeholder="Password"
            className="p-input text-lg p-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <small className="p-error text-sm -mt-3">{errors.password}</small>
          )}
          <Button
            className="text-white bg-mainGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="8"
                animationDuration="1s"
                color="white"
              />
            ) : (
              <p>Masuk</p>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
