import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import logo from "../../../assets/PRB-CARE-LOGO.png";

const LoginPuskesmas = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <div className="flex w-full flex-col gap-6 md:w-1/2">
        <div className="flex flex-col w-full justify-center items-center">
          <img className="h-48 w-48" src={logo} alt="" />
        </div>
        <div className="flex flex-col w-full gap-4">
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
            Masuk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPuskesmas;
