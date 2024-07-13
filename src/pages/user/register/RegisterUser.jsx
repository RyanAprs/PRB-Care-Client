import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import logo from "../../../assets/PRB-CARE-LOGO.png";
import { Link } from "react-router-dom";

const RegisterUser = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <div className="flex w-full flex-col gap-6 md:w-1/2 items-center justify-center">
        <div className="flex flex-col w-full justify-center items-center">
          {/* <h1 className="font-bold text-5xl text-darkColor">PRB CARE</h1> */}
          <img className="h-auto w-48" src={logo} alt="" />
        </div>
        <div className="flex flex-col w-full gap-4">
          <Input type="text" variant="bordered" label="Nama Lengkap" />
          <Input type="text" variant="bordered" label="Username" />
          <Input type="password" variant="bordered" label="Password" />
        </div>
        <div className="flex flex-col w-full gap-4">
          <Button
            color="default"
            className=" text-white bg-buttonCollor font-bold"
            type="submit"
            radius="sm"
            size="lg"
          >
            Daftar
          </Button>
          <div className="flex items-center justify-center font-bold text-sm text-darkColor">
            ATAU
          </div>
          <Link to="/user/login" className="w-full">
            <Button
              variant="bordered"
              className=" text-buttonCollor font-bold w-full"
              radius="sm"
              size="lg"
            >
              Masuk
            </Button>
          </Link>
        </div>
        <p className="text-center px-4">
          <span className="font-normal opacity-60">
            Dengan mengklik Daftar, Anda menyetujui{" "}
          </span>
          <span className="font-bold opacity-100">Ketentuan layanan</span>{" "}
          <span className="font-normal opacity-60">dan</span>{" "}
          <span className="font-bold opacity-100"> kebijakan privasi kami</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
