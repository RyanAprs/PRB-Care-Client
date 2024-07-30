import LoginForm from "../../../components/form/LoginForm";

const LoginPuskesmas = () => {
  const API_URI = `${
    import.meta.env.VITE_API_BASE_URI
  }/api/admin-puskesmas/login`;

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <LoginForm
        API_URI={API_URI}
        navigateUser="/puskesmas/home"
        role="nakes"
        title="Puskesmas"
      />
    </div>
  );
};

export default LoginPuskesmas;
