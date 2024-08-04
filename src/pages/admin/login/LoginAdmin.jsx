import LoginForm from "../../../components/form/LoginForm";

const LoginAdmin = () => {
  const API_URI = `${import.meta.env.VITE_API_BASE_URI}/api/admin-super/login`;
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <LoginForm
        API_URI={API_URI}
        navigateUser="/admin/beranda"
        role="admin"
        title="Admin"
      />
    </div>
  );
};

export default LoginAdmin;
