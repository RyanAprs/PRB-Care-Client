import { Button } from "primereact/button";
const LoginRequired = ()=>{
    return (
        <div className="md:p-4 p-2 dark:bg-black bg-whiteGrays h-screen flex justify-center items-center">
            <div
                className="p-8 w-full h-full flex flex-col items-center justify-center bg-white dark:bg-blackHover rounded-xl">
                <div
                    className="flex h-screen flex-col items-center justify-center text-center font-bold gap-3 text-3xl">
                    Login Untuk Akses
                    <p className="font-medium text-xl">
                        Lakukan login terlebih dahulu untuk melihat data
                    </p>
                    <Button
                        label="Login"
                        onClick={() => navigate("/pengguna/login")}
                        className="bg-mainGreen py-2 dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen  md:w-auto flex items-center justify-center gap-2 transition-all text-white p-4 rounded-xl"
                    />
                </div>
            </div>
        </div>
    )
}
export default LoginRequired;