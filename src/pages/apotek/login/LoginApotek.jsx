import LoginForm from "../../../components/form/LoginForm";

const LoginApotek = () => {
  const API_URI = `${import.meta.env.VITE_API_BASE_URI}/api/admin-apotek/login`;

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <LoginForm
        API_URI={API_URI}
        navigateUser="/apotek/beranda"
        role="apoteker"
        title="Apotek"
      />
    </div>
  );
};

export default LoginApotek;
