import LoginForm from "../../../components/form/LoginForm";


const LoginPengguna = () => {
    const API_URI = `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/login`;


    return (
        <div className="min-h-screen w-full flex justify-center items-center md:p-0 px-8">
            <LoginForm
                API_URI={API_URI}
                navigateUser="/pengguna/beranda"
                role="pengguna"
                title="Pengguna"
            />
        </div>
    );
};

export default LoginPengguna;
